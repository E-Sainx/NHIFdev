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
        uint256 totalContributions;
    }

    struct Provider {
        bool isRegistered;
        uint256 balance;
    }

    struct Claim {
        uint256 nationalId;
        address provider;
        uint256 amount;
        bool isPaid;
        string ipfsHash;
        ClaimStatus status;
        string serviceType; // New field for service type
    }

    enum ClaimStatus {
        Submitted,
        UnderReview,
        Approved,
        Rejected
    }

    mapping(uint256 => Member) public members; // nationalId => Member
    mapping(address => Provider) public providers;
    mapping(uint256 => mapping(uint256 => uint256)) public memberYearlyClaims; // nationalId => year => total claims

    Claim[] public claims;

    uint256 public constant AUTO_APPROVE_LIMIT = 100 ether;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 ether;
    uint256 public constant YEARLY_CLAIM_LIMIT = 5000 ether;

    event MemberRegistered(uint256 indexed nationalId, string name);
    event ContributionPaid(uint256 indexed nationalId, uint256 amount, address payer);
    event ClaimSubmitted(uint256 indexed claimId, uint256 nationalId, address provider, uint256 amount, string serviceType);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus newStatus);
    event ClaimPaid(uint256 indexed claimId, address provider, uint256 amount);
    event ProviderRegistered(address provider);
    event ProviderRemoved(address provider);
    event ProviderWithdrawal(address provider, uint256 amount);

    modifier onlyProvider() {
        require(providers[msg.sender].isRegistered, "Only registered providers can call this function");
        _;
    }

    function registerMember(uint256 _nationalId, string memory _name) public returns (bool) {
        require(_nationalId != 0, "Invalid national ID");
        require(bytes(_name).length > 0, "Name cannot be empty");
        if (members[_nationalId].isActive) {
            return false; // Member already registered
        }
        members[_nationalId] = Member(_name, 0, true, 0);
        emit MemberRegistered(_nationalId, _name);
        return true;
    }

    function getMemberStatus(uint256 _nationalId) public view returns (
        bool isActive,
        string memory name,
        uint256 lastContributionDate,
        uint256 totalContributions
    ) {
        Member storage member = members[_nationalId];
        return (member.isActive, member.name, member.lastContributionDate, member.totalContributions);
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
        members[_nationalId].totalContributions += msg.value;
        emit ContributionPaid(_nationalId, msg.value, msg.sender);
    }

    function getMemberTotalContributions(uint256 _nationalId) public view returns (uint256) {
        return members[_nationalId].totalContributions;
    }

    function selfRegisterProvider() public {
        require(!providers[msg.sender].isRegistered, "Provider already registered");
        providers[msg.sender] = Provider(true, 0);
        emit ProviderRegistered(msg.sender);
    }

    function registerProvider(address _provider) public onlyOwner {
        require(!providers[_provider].isRegistered, "Provider already registered");
        providers[_provider] = Provider(true, 0);
        emit ProviderRegistered(_provider);
    }

    function removeProvider(address _provider) public onlyOwner {
        require(providers[_provider].isRegistered, "Provider not registered");
        providers[_provider].isRegistered = false;
        emit ProviderRemoved(_provider);
    }

    function submitClaim(
        uint256 _nationalId,
        uint256 _amount,
        string memory _ipfsHash,
        string memory _serviceType
    ) public onlyProvider nonReentrant {
        require(members[_nationalId].isActive, "Member not registered");
        require(_amount <= MAX_CLAIM_AMOUNT, "Claim amount too high");
        require(block.timestamp - members[_nationalId].lastContributionDate <= 30 days, "Contribution not up to date");

        uint256 year = (block.timestamp / 365 days) + 1970;
        memberYearlyClaims[_nationalId][year] += _amount;
        require(memberYearlyClaims[_nationalId][year] <= YEARLY_CLAIM_LIMIT, "Yearly claim limit exceeded");

        uint256 claimId = claims.length;
        ClaimStatus status = _amount <= AUTO_APPROVE_LIMIT ? ClaimStatus.Approved : ClaimStatus.UnderReview;
        claims.push(Claim(_nationalId, msg.sender, _amount, false, _ipfsHash, status, _serviceType));
        emit ClaimSubmitted(claimId, _nationalId, msg.sender, _amount, _serviceType);
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
        require(address(this).balance >= claim.amount, "Insufficient contract balance");

        claim.isPaid = true;
        providers[claim.provider].balance += claim.amount;
        emit ClaimPaid(_claimId, claim.provider, claim.amount);
    }

    function getClaimsCount() public view returns (uint256) {
        return claims.length;
    }

    function getAllClaims() public view returns (
        uint256[] memory,
        address[] memory,
        uint256[] memory,
        string[] memory,
        ClaimStatus[] memory,
        string[] memory,
        uint256[] memory
    ) {
        uint256 count = claims.length;
        uint256[] memory claimIds = new uint256[](count);
        address[] memory providersList = new address[](count);
        uint256[] memory nationalIds = new uint256[](count);
        string[] memory names = new string[](count);
        ClaimStatus[] memory statuses = new ClaimStatus[](count);
        string[] memory serviceTypes = new string[](count);
        uint256[] memory amounts = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Claim storage claim = claims[i];
            claimIds[i] = i;
            providersList[i] = claim.provider;
            nationalIds[i] = claim.nationalId;
            names[i] = members[claim.nationalId].name;
            statuses[i] = claim.status;
            serviceTypes[i] = claim.serviceType;
            amounts[i] = claim.amount;
        }

        return (claimIds, providersList, nationalIds, names, statuses, serviceTypes, amounts);
    }

    function withdrawFunds(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }

    function isRegisteredProvider(address _provider) public view returns (bool) {
        return providers[_provider].isRegistered;
    }

    function getProviderBalance(address _provider) public view returns (uint256) {
        return providers[_provider].balance;
    }

    function providerWithdraw(uint256 _amount) public nonReentrant {
        require(providers[msg.sender].isRegistered, "Provider not registered");
        require(providers[msg.sender].balance >= _amount, "Insufficient balance");

        providers[msg.sender].balance -= _amount;
        payable(msg.sender).transfer(_amount);
        emit ProviderWithdrawal(msg.sender, _amount);
    }

    function getAddressBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }

    receive() external payable {
        // Allow the contract to receive Ether
    }
}
