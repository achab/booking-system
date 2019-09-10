const fs = require("fs");
const Web3 = require("web3");
// const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
// const provider = new Web3.providers.WebsocketProvider(
//   "https://ropsten.infura.io/ws/v3/dfa42e01249b4a15b477718fc7aff9cb"
// );
const web3 = new Web3(provider);

const contract_json = fs.readFileSync(
  "/Users/massil/Code/Ethereum/booking-system/booking-app/build/contracts/TimeTable.json"
);
const contract_parsed = JSON.parse(contract_json);

const abi = contract_parsed["abi"];
const networks = contract_parsed["networks"];
const address = networks[Object.keys(networks)[0]]["address"];

console.log("Contract address: ", address);

const contract_instance = new web3.eth.Contract(abi, address);

// contract_instance.methods.manager().call().then(console.log)
// contract_instance.methods.getAvailability().call().then(console.log)
// contract_instance.methods
//   .getOwners()
//   .call()
//   .then(console.log);
// contract_instance.once("Debug", {}, function(error, event) {
//   console.log(event);
// });

contract_instance.getPastEvents(
  "allEvents",
  { fromBlock: 0, toBlock: "latest" },
  (errors, events) => {
    if (!errors) {
      console.log("Events:", events.map(elt => elt.event));
    }
  }
);

// contract_instance.methods.totalSupply().call().then(result => console.log('Total supply: ', result.toString())).catch((err) => console.error(err));
// contract_instance.methods.name().call().then(result => console.log('Name:', result.toString())).catch((err) => console.error(err));

// constants for token
const account = "0xeF8ad8092936AD55EeE32fA374f7Da9fa898368E";
const controller = "0x99eA753AC62D83B432De5B672deeb6545320011F";
const partition1 =
  "0x5265736572766564000000000000000000000000000000000000000000000000";
const issuanceAmount = 1000000;
const VALID_CERTIFICATE =
  "0x1000000000000000000000000000000000000000000000000000000000000000";
// constants for transfer
const to = "0x9B1b05e343ABe882098309b87A563525351aFd4D";
const amount = 5;

// is account white listed ?
// contract_instance.methods.whitelisted(account).call().then(result => console.log('Is whitelisted:', result.toString())).catch((err) => console.error(err));

// append account to white list
// addTowhitelist = async () => {
// 	await contract_instance.methods.setWhitelisted(account, true).send({ from: controller });
// };
// addTowhitelist();

// list of partitions
// contract_instance.methods.totalPartitions().call().then(result => console.log('Total partitions:', result)).catch((err) => console.error(err));

// owner name
// contract_instance.methods.owner().call().then(result => console.log('Owner:', result)).catch((err) => console.error(err));

// controller names
// contract_instance.methods.controllers().call().then(result => console.log('Controllers:', result)).catch((err) => console.error(err));

// balance of account
// contract_instance.methods.balanceOf(account).call().then(result => console.log('Balance of `account`:', result.toString())).catch((err) => console.error(err));
// contract_instance.methods.balanceOf(to).call().then(result => console.log('Balance of `to`:', result.toString())).catch((err) => console.error(err));

// issue money
// issueByPart = async () => {
// 	await contract_instance.methods.issueByPartition(partition1, account, issuanceAmount, VALID_CERTIFICATE)
// 	.send({ from: controller, 'gasLimit': '1000000' })
// 	.then(result => console.log('tmp:', result))
// 	.catch((err) => console.error(err));
// };
// issueByPart();

// transfer money
// transfer = async () => {
// 	await contract_instance.methods.transferFromWithData(account, to, amount, VALID_CERTIFICATE, VALID_CERTIFICATE)
// 	.send({ from: controller, 'gasLimit': '1000000' })
// 	.then(result => console.log('tmp:', result))
// 	.catch((err) => console.error(err));
// };
// transfer();
