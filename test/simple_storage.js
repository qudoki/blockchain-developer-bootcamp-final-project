// const SimpleStorage = artifacts.require("SimpleStorage");

// /*
//  * uncomment accounts to access the test accounts made available by the
//  * Ethereum client
//  * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
//  */
// contract("SimpleStorage", function (/* accounts */) {
//   it("should assert true", async function () {
//     await SimpleStorage.deployed();
//     return assert.isTrue(true);
//   });
// });


const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", function (accounts) {
  describe("Initial deployment", async () => {
    it("should assert true", async function () {
      await SimpleStorage.deployed();
      assert.isTrue(true);
    });

    it("was deployed and has an initial value of 0", async () => {
      // get subject
      const ssInstance = await SimpleStorage.deployed();
      // verify that it starts with zero
      const storedData = await ssInstance.getStoredData.call();
      assert.equal(storedData, 0, `Initial state should be zero`);
    });
  });
  describe("Functionality", () => {
    it("should store a new value 42", async () => {
      // get subject
      const ssInstance = await SimpleStorage.deployed();
      // change the number
      await ssInstance.setStoredData(42, { from: accounts[0] });
      // verify we changed the subject
      const storedData = await ssInstance.getStoredData.call();
      assert.equal(storedData, 42, `${storedData} was not stored!`);
    });
  });
  it("should not let someone else change the variable", async () => {
    // grab instance
    const [owner, badJoe] = accounts;
    const ssInstance = await SimpleStorage.new(42);
    try {
      await ssInstance.setStoredData(22, { from: badJoe })
    } catch(err) { }
    const balance = await web3.eth.getBalance(accounts[2]);
    console.log(balance);
    const storedData = await ssInstance.getStoredData.call();
    assert.equal(storedData, 42, 'storedData was not changed!')
  })
});


// from previous test simple storage:
// pragma solidity >=0.4.21 <0.7.0;

// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";
// import "../contracts/SimpleStorage.sol";

// contract TestSimpleStorage {

//   function testItStoresAValue() public {
//     SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

//     simpleStorage.set(89);

//     uint expected = 89;

//     Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
//   }

// }
