const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, account1, account2, SharedWallet, sharedWallet;

before(async () => {
  [owner, account1, account2] = await ethers.getSigners();
  SharedWallet = await ethers.getContractFactory("SharedWallet");
});

describe("SharedWallet", () => {
  beforeEach(async () => {
    sharedWallet = await SharedWallet.deploy();
    await sharedWallet.deployed();
  });

  describe("when an account sends funds to smart contract", () => {
    it("should increase smart contract balance by same amount", async () => {
      await account1.sendTransaction({
        to: sharedWallet.address,
        value: ethers.utils.parseEther("1.0"),
      });

      expect(await sharedWallet.getContractBalance()).to.equal(
        ethers.utils.parseEther("1.0")
      );
    });
  });

  describe("when owner withdraw funds from smart contract balance", () => {
    describe("when smart contract has enough funds", () => {
      it("should withdraw smart contract balance by same amount", async () => {
        const ethAmount = ethers.utils.parseEther("1.0");
        await account1.sendTransaction({
          to: sharedWallet.address,
          value: ethAmount,
        });

        const account1InitialBalance = await account1.getBalance();

        await sharedWallet
          .connect(owner)
          .withdrawFundsFromContract(account1.address, ethAmount);

        expect(await sharedWallet.getContractBalance()).to.equal(
          ethers.utils.parseEther("0")
        );
        expect(await account1.getBalance()).to.equal(
          account1InitialBalance.add(ethAmount)
        );
      });
    });

    describe("when smart contract does not have enough funds", () => {
      it("should revert", async () => {
        const ethAmount = ethers.utils.parseEther("1.0");
        await expect(
          sharedWallet
            .connect(owner)
            .withdrawFundsFromContract(account1.address, ethAmount)
        ).to.be.reverted;
      });
    });
  });

  describe("when owner adds allowance to an account", () => {
    it("should add the allowance to the account", async () => {
      const ethAmount = ethers.utils.parseEther("1.0");
      const account1InitialAllowance = await sharedWallet.getMemberAllowance(
        account1.address
      );

      await sharedWallet
        .connect(owner)
        .addAllowance(account1.address, ethAmount);

      const account1UpdatedAllowance = await sharedWallet.getMemberAllowance(
        account1.address
      );

      expect(account1InitialAllowance).to.equal(ethers.utils.parseEther("0"));
      expect(account1UpdatedAllowance).to.equal(ethAmount);
    });
  });

  describe("when owner reduces the allowance of an account", () => {
    it("should reduce the allowance of the account", async () => {
      const ethAmount = ethers.utils.parseEther("1.0");
      const ethAmountReduced = ethers.utils.parseEther("0.5");
      await sharedWallet
        .connect(owner)
        .addAllowance(account1.address, ethAmount);

      const account1InitialAllowance = await sharedWallet.getMemberAllowance(
        account1.address
      );

      await sharedWallet
        .connect(owner)
        .reduceAllowance(account1.address, ethAmountReduced);

      const account1UpdatedAllowance = await sharedWallet.getMemberAllowance(
        account1.address
      );

      expect(account1InitialAllowance).to.equal(ethAmount);
      expect(account1UpdatedAllowance).to.equal(
        account1InitialAllowance.sub(ethAmountReduced)
      );
    });
  });

  describe("when owner reduces the allowance of an account without any allowance", () => {
    it("should revert", async () => {
      const ethAmount = ethers.utils.parseEther("1.0");

      await expect(
        sharedWallet.connect(owner).reduceAllowance(account1.address, ethAmount)
      ).to.be.reverted;
    });
  });

  describe("when non owner adds allowance for an account", () => {
    it("should revert the transaction", async () => {
      const ethAmount = ethers.utils.parseEther("1.0");

      await expect(
        sharedWallet.connect(account1).addAllowance(account1.address, ethAmount)
      ).to.be.reverted;
    });
  });

  describe("when non owner reduces allowance for an account", () => {
    it("should revert the transaction", async () => {
      const ethAmount = ethers.utils.parseEther("1.0");

      await expect(
        sharedWallet
          .connect(account1)
          .reduceAllowance(account1.address, ethAmount)
      ).to.be.reverted;
    });
  });

  describe("when member withdraw funds from smart contract balance", () => {
    describe("when member has enough allowance", () => {
      it("should withdraw smart contract balance by same amount", async () => {
        const ethAmount = ethers.utils.parseEther("1.0");
        const ethAllowanceAmount = ethers.utils.parseEther("5.0");
        const ethAmountWithdrawn = ethers.utils.parseEther("0.5");
        await owner.sendTransaction({
          to: sharedWallet.address,
          value: ethAmount,
        });

        await sharedWallet
          .connect(owner)
          .addAllowance(account2.address, ethAllowanceAmount);

        const account1InitialBalance = await account1.getBalance();

        await sharedWallet
          .connect(account2)
          .withdrawFundsFromContract(account1.address, ethAmountWithdrawn);

        expect(await sharedWallet.getContractBalance()).to.equal(
          ethAmount.sub(ethAmountWithdrawn)
        );

        expect(await account1.getBalance()).to.equal(
          account1InitialBalance.add(ethAmountWithdrawn)
        );

        expect(
          await sharedWallet.getMemberAllowance(account2.address)
        ).to.equal(ethAllowanceAmount.sub(ethAmountWithdrawn));
      });
    });
    describe("when member does not have enough allowance", () => {
      it("should revert", async () => {
        const ethAllowanceAmount = ethers.utils.parseEther("5.0");
        const ethAmountWithdrawn = ethers.utils.parseEther("6.0");

        await sharedWallet
          .connect(owner)
          .addAllowance(account2.address, ethAllowanceAmount);

        await expect(
          sharedWallet
            .connect(account2)
            .withdrawFundsFromContract(account1.address, ethAmountWithdrawn)
        ).to.be.reverted;
      });
    });
  });
});
