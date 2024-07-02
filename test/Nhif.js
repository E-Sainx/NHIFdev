const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("NHIF contract", function () {
  async function deployNHIFFixture() {
    const NHIF = await ethers.getContractFactory("NHIF");
    const [owner, addr1, addr2, provider] = await ethers.getSigners();
    const monthlyContributionWei = ethers.utils.parseEther("1");
    const nhif = await NHIF.deploy(monthlyContributionWei);

    await nhif.deployed();

    return { NHIF, nhif, owner, addr1, addr2, provider, monthlyContributionWei };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nhif, owner } = await loadFixture(deployNHIFFixture);
      expect(await nhif.owner()).to.equal(owner.address);
    });

    it("Should set the right monthly contribution", async function () {
      const { nhif, monthlyContributionWei } = await loadFixture(deployNHIFFixture);
      expect(await nhif.getMonthlyContribution()).to.equal(monthlyContributionWei);
    });
  });

  describe("Member Registration", function () {
    it("Should register a member", async function () {
      const { nhif, addr1 } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      const member = await nhif.getMemberStatus(1234);
      expect(member.name).to.equal("John Doe");
      expect(member.isActive).to.be.true;
    });

    it("Should not register the same member twice", async function () {
      const { nhif } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      expect(await nhif.registerMember(1234, "John Doe")).to.be.false;
    });
  });

  describe("Contributions", function () {
    it("Should allow a member to make a contribution", async function () {
      const { nhif, addr1, monthlyContributionWei } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      await nhif.connect(addr1).makeContribution(1234, { value: monthlyContributionWei });

      const member = await nhif.getMemberStatus(1234);
      expect(member.lastContributionDate).to.be.gt(0);
    });

    it("Should fail if contribution amount is incorrect", async function () {
      const { nhif, addr1, monthlyContributionWei } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      await expect(
        nhif.connect(addr1).makeContribution(1234, { value: monthlyContributionWei.sub(1) })
      ).to.be.revertedWith("Incorrect contribution amount");
    });
  });

  describe("Provider Registration", function () {
    it("Should allow the owner to register a provider", async function () {
      const { nhif, provider } = await loadFixture(deployNHIFFixture);
      await nhif.registerProvider(provider.address);
      expect(await nhif.isRegisteredProvider(provider.address)).to.be.true;
    });

    it("Should allow the owner to remove a provider", async function () {
      const { nhif, provider } = await loadFixture(deployNHIFFixture);
      await nhif.registerProvider(provider.address);
      await nhif.removeProvider(provider.address);
      expect(await nhif.isRegisteredProvider(provider.address)).to.be.false;
    });
  });

  describe("Claims", function () {
    it("Should allow a registered provider to submit a claim", async function () {
      const { nhif, addr1, provider, monthlyContributionWei } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      await nhif.connect(addr1).makeContribution(1234, { value: monthlyContributionWei });
      await nhif.registerProvider(provider.address);
      await nhif.connect(provider).submitClaim(1234, ethers.utils.parseEther("10"), "QmHash");

      const claimsCount = await nhif.getClaimsCount();
      expect(claimsCount).to.equal(1);

      const claim = await nhif.claims(0);
      expect(claim.nationalId).to.equal(1234);
      expect(claim.amount).to.equal(ethers.utils.parseEther("10"));
      expect(claim.ipfsHash).to.equal("QmHash");
      expect(claim.status).to.equal(0); // Submitted status
    });

    it("Should fail if a non-provider tries to submit a claim", async function () {
      const { nhif, addr1, monthlyContributionWei } = await loadFixture(deployNHIFFixture);
      await nhif.registerMember(1234, "John Doe");
      await nhif.connect(addr1).makeContribution(1234, { value: monthlyContributionWei });

      await expect(
        nhif.connect(addr1).submitClaim(1234, ethers.utils.parseEther("10"), "QmHash")
      ).to.be.revertedWith("Only registered providers can call this function");
    });
  });
});
