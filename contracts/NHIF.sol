// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NHIF is ReentrancyGuard, Ownable {
    uint256 public monthlyContributionWei; // Monthly contribution in wei

    constructor(uint256 _monthlyContributionWei) Ownable(msg.sender) {
        monthlyContributionWei = _monthlyContributionWei;
    }


    struct Member {
        string name;
        uint256 lastContributionDate;
        bool isActive;
    }

    struct Claim {
        uint256 nationalId;
        address provider;
        uint256 amount;
        bool isPaid;
        string ipfsHash;
        ClaimStatus status;
    }

    enum ClaimStatus {
        Submitted,
        UnderReview,
        Approved,
        Rejected
    }

    mapping(uint256 => Member) public members; // nationalId => Member
    mapping(address => bool) public providers;
    mapping(uint256 => mapping(uint256 => uint256)) public memberYearlyClaims; // nationalId => year => total claims

    Claim[] public claims;

    uint256 public constant AUTO_APPROVE_LIMIT = 100 ether;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 ether;
    uint256 public constant YEARLY_CLAIM_LIMIT = 5000 ether;

    event MemberRegistered(uint256 indexed nationalId, string name);
    event ContributionPaid(uint256 indexed nationalId, uint256 amount, address payer);
    event ClaimSubmitted(uint256 indexed claimId, uint256 nationalId, address provider, uint256 amount);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus newStatus);
    event ClaimPaid(uint256 indexed claimId, address provider, uint256 amount);
    event ProviderRegistered(address provider);
    event ProviderRemoved(address provider);

    modifier onlyProvider() {
        require(providers[msg.sender], "Only registered providers can call this function");
        _;
    }

    function registerMember(uint256 _nationalId, string memory _name) public returns (bool) {
        require(_nationalId != 0, "Invalid national ID");
        require(bytes(_name).length > 0, "Name cannot be empty");
        if (members[_nationalId].isActive) {
            return false; // Member already registered
        }
        members[_nationalId] = Member(_name, 0, true);
        emit MemberRegistered(_nationalId, _name);
        return true;
    }

    function getMemberStatus(uint256 _nationalId) public view returns (bool isActive, string memory name, uint256 lastContributionDate) {
        Member storage member = members[_nationalId];
        return (member.isActive, member.name, member.lastContributionDate);
    }

    function isMemberActive(uint256 _nationalId) public view returns (bool) {
        return members[_nationalId].isActive;
    }

    function setMonthlyContribution(uint256 _newContributionWei) public onlyOwner {
        monthlyContributionWei = _newContributionWei;
    }

    function getMonthlyContribution() public view returns (uint256) {
        return monthlyContributionWei;
    }

    function makeContribution(uint256 _nationalId) public payable nonReentrant {
        require(_nationalId != 0, "Invalid national ID");
        require(isMemberActive(_nationalId), "Member not registered or inactive");
        require(msg.value == monthlyContributionWei, "Incorrect contribution amount");

        members[_nationalId].lastContributionDate = block.timestamp;
        emit ContributionPaid(_nationalId, msg.value, msg.sender);
    }

    function registerProvider(address _provider) public onlyOwner {
        require(!providers[_provider], "Provider already registered");
        providers[_provider] = true;
        emit ProviderRegistered(_provider);
    }

    function removeProvider(address _provider) public onlyOwner {
        require(providers[_provider], "Provider not registered");
        providers[_provider] = false;
        emit ProviderRemoved(_provider);
    }

    function submitClaim(uint256 _nationalId, uint256 _amount, string memory _ipfsHash) public onlyProvider nonReentrant {
        require(members[_nationalId].isActive, "Member not registered");
        require(_amount <= MAX_CLAIM_AMOUNT, "Claim amount too high");
        require(block.timestamp - members[_nationalId].lastContributionDate <= 30 days, "Contribution not up to date");

        uint256 year = (block.timestamp / 365 days) + 1970;
        memberYearlyClaims[_nationalId][year] += _amount;
        require(memberYearlyClaims[_nationalId][year] <= YEARLY_CLAIM_LIMIT, "Yearly claim limit exceeded");

        uint256 claimId = claims.length;
        ClaimStatus status = _amount <= AUTO_APPROVE_LIMIT ? ClaimStatus.Approved : ClaimStatus.UnderReview;
        claims.push(Claim(_nationalId, msg.sender, _amount, false, _ipfsHash, status));
        emit ClaimSubmitted(claimId, _nationalId, msg.sender, _amount);
        emit ClaimStatusUpdated(claimId, status);

        if (status == ClaimStatus.Approved) {
            processClaim(claimId);
        }
    }

    function reviewClaim(uint256 _claimId, ClaimStatus _newStatus) public onlyOwner {
        require(_claimId < claims.length, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.UnderReview, "Claim is not under review");
        require(_newStatus == ClaimStatus.Approved || _newStatus == ClaimStatus.Rejected, "Invalid new status");

        claim.status = _newStatus;
        emit ClaimStatusUpdated(_claimId, _newStatus);

        if (_newStatus == ClaimStatus.Approved) {
            processClaim(_claimId);
        }
    }

    function processClaim(uint256 _claimId) internal {
        Claim storage claim = claims[_claimId];
        require(!claim.isPaid, "Claim already paid");
        require(claim.status == ClaimStatus.Approved, "Claim not approved");

        claim.isPaid = true;
        payable(claim.provider).transfer(claim.amount);
        emit ClaimPaid(_claimId, claim.provider, claim.amount);
    }

    function getClaimsCount() public view returns (uint256) {
        return claims.length;
    }

    function withdrawFunds(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }

    function isRegisteredProvider(address _provider) public view returns (bool) {
        return providers[_provider];
    }

    receive() external payable {
        // Allow the contract to receive Ether
    }
}
