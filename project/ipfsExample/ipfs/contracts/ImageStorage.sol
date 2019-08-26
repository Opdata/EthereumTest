pragma solidity >=0.5.0; 

contract ImageStorage {
    string[] ipfsImages;
    
    function registerImage(string memory _hash) public { 
        ipfsImages.push(_hash);
    }
    function getImage(uint _i) public view returns(string memory) { 
        return ipfsImages[_i];
    } 
}