// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Fallout} from "../../src/levels/Fallout.sol";

contract FalloutTest is Test {
    Fallout private fallout;
    address private attacker = address(0x123);

    function setUp() public {
        fallout = new Fallout();
    }

    function testFalloutContract() external{
    vm.deal(attacker, 1 ether);
    vm.startPrank(attacker);
    fallout.Fal1out();
    address newOwner = fallout.owner();
    assertEq(newOwner,attacker,"New owner not set. Attack failed.");
    vm.stopPrank();   
    }

}
