const GetterSetter = artifacts.require("GetterSetter");
//JS에서 import 같은게 require

contract("GetterSetter", accounts => {  //fallback acounts 리턴 파라미터
                        //function(accounts){}
    let initialMessage = "Initial message";
    let myContract;
 // tests go here
    before("Setup contract", async () => {
    myContract = await GetterSetter.new(initialMessage);
   });

   let totalTransferredEther = 0;
   beforeEach("Get 1 ether before each test", async () => {
      await myContract.sendTransaction({from: accounts[0], value: await web3.utils.toWei("1", "ether")});
      totalTransferredEther++;
});



   it("Test initial message", async () => {
    let storedMessage = await myContract.getMessage();
    assert.equal(storedMessage, initialMessage, "Constructor and getMessage should match");
   });

   it("Test set and get message", async () => {
    let newMessage = "New message";
    await myContract.setMessage(newMessage);
    let storedMessage = await myContract.getMessage();
    assert.equal(newMessage, storedMessage, "setMessage and getMessage should match");
   });

   it("Test transfer ether", async () => {
      let balance = await web3.eth.getBalance(myContract.address);
      let totalTransferredWei = await
     web3.utils.toWei(totalTransferredEther.toString(), "ether");
      assert.equal(balance, totalTransferredWei, "Total ether transferred and balance should match");
     });
});
