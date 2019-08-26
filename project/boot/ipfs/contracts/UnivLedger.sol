pragma solidity ^0.5.0;

import './newUniv.sol';

contract UnivLedger{

    address payable owner;
    uint entryFee = 10 ether;
    uint representativeNum; // (학생회 + 총학 대표들) 수

    address[] private studentAddresses;

    // 자격 가진 사람 아니면 못하는 modifier
    mapping(address => newUniv) UnivAddToInfo;

    modifier onlyRegisterUniv(address _univAdd){
        require(address(UnivAddToInfo[_univAdd])!=address(0));
        _;
    }

    // 웹에서 보내는 정보를 토대로 스마트 컨트랙트를 배포할 것이기 때문에 인자를 받아와야 한다
    constructor() public {
        owner=msg.sender;
    }

    function registerUniv(string memory _UnivName, uint _representativeNum) public payable {
        require(msg.value>=entryFee);
        newUniv univ = new newUniv(_UnivName,_representativeNum);
        UnivAddToInfo[address(univ)]=univ;
    }

    //학생회 + 단과대 대표들 계좌 주소 받는 함수!
    function child_addAddress(address _univAdd ,address _studentAddress) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].addAddress(_studentAddress);
    }

    // function getUnivBalance() public view returns (uint) {
    //     return address(this).balance;
    // }

    function child_createVote(address _univAdd,string memory _votingAgenda) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].createVote(_votingAgenda);
    }

    function child_doVote(address _univAdd,bool _agree) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].doVote(_agree);
    }

    function child_updateVote(address _univAdd) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].updateVote();
    }

    function child_deposit(address _univAdd) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].deposit();
    }

    function child_transfer(address _univAdd,uint _amount) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].transfer(_amount);
    }
      string[] ipfsImages;
    uint ipfsCnt=0;
    
    function registerImage(string memory _hash) public { 
        ipfsImages.push(_hash);
        ipfsCnt++;
    }

    function getImage(uint _i) public view returns(string memory) { 
        return ipfsImages[_i];
    }

    function getIpfsCnt() public view returns(uint) { 
        return ipfsCnt;
    }
}