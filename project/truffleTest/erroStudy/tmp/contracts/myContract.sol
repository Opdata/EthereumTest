pragma solidity 0.5.0;


contract myContract {
    address payable owner = msg.sender;
    address payable charity = 0x5256bc504Be9d6B9B7aef14bFB75e0239C10C365; 
    
    mapping(address => uint) balances;
    
    event DepositEvent( 
        uint time,
        uint indexed blockNumber,
        address indexed senderAddress,
        uint valueWei
    );

    function withdraw() public {
        require(address(this).balance > 0, 'No funds available.');
        if(msg.sender == owner) {
            owner.transfer(1 ether); charity.transfer(address(this).balance);
        } else if(msg.sender == charity) { 
            owner.transfer(10 ether); charity.transfer(address(this).balance);
        } else {
            revert('Not allowed to withdraw funds.');
        } 
    }
    
    function deposit() public payable { 
        balances[msg.sender] += msg.value; 
        emit DepositEvent(
            now,
            block.number,
            msg.sender,
            msg.value
        ); 
    }

    function() external payable {

    }
}