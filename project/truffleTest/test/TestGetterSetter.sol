pragma solidity 0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/GetterSetter.sol";

contract TestGetterSetter{
    address payable myContractAddress = address(uint160(DeployedAddresses.GetterSetter()));
    GetterSetter myContract = GetterSetter(myContractAddress);
    
    function testInitialMessage() public {
        string memory initialMessage = "Initial message";
        GetterSetter myNewContract = new GetterSetter(initialMessage);
        Assert.equal(myNewContract.getMessage(), initialMessage, "Constructor and getMessage should match");
        }
    function testSetGetMessage() public {
        string memory newMessage = "New message";
        myContract.setMessage(newMessage);
        Assert.equal(myContract.getMessage(), newMessage, "setMessage and getMessage should match");

}
}
