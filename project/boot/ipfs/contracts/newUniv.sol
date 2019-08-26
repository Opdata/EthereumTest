pragma solidity ^0.5.0;

contract newUniv{

    string univName;
    uint representativeNum;
    address admin;
    uint32 addressCount = 0;

    // 웹에서 보내는 정보를 토대로 스마트 컨트랙트를 배포할 것이기 때문에 인자를 받아와야 한다
    constructor(string memory _UnivName, uint _representativeNum) public {
        univName = _UnivName;
        representativeNum = _representativeNum;
        admin = msg.sender;
    }

    struct Vote {
        string agenda;
        bool ing;
        uint votingCnt;
        uint agreeCnt;
        uint timeStamp;
        bool pass;
    }
    
    Vote vote;

    struct Executive {
        address studentAddress;
        mapping(string => bool) checkVote;
    }
    
    mapping(address => Executive) inExecutives;

    modifier onlyExecutives() {
        require(inExecutives[msg.sender].studentAddress != address(0));
        _;
    }
    
    function addAddress(address _studentAddress) public {
        require(representativeNum > addressCount);
        addressCount++;
        Executive memory newExecutive;
        newExecutive.studentAddress = _studentAddress;
        inExecutives[_studentAddress] = newExecutive;
    }
    
    function createVote(string memory _votingAgenda) public onlyExecutives {
        vote.agenda = _votingAgenda;
        vote.ing = true;
        vote.timeStamp = now;
    }
        
    function doVote(bool _agree) public onlyExecutives {
        require(!inExecutives[msg.sender].checkVote[vote.agenda] && vote.ing);
        vote.votingCnt++;
        inExecutives[msg.sender].checkVote[vote.agenda]=true;
        if(_agree) {
            vote.agreeCnt++;
        }
    }
    
    function updateVote() public { //새로고침 => 투표 종료
        if(now > vote.timeStamp) {
            vote.ing = false;
        }
        if(vote.agreeCnt * 3 > vote.votingCnt * 2) {
            vote.pass = true;
        }
    }

    function deposit() public payable{
        require(msg.sender==admin);
    }
        
    function getUnivBalance() public view returns (uint) {
        return address(this).balance;
    }

    function transfer(uint _amount) public {
        require(vote.pass);
        require(msg.sender == admin);
        require(getUnivBalance() > _amount);
        msg.sender.transfer(_amount);
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