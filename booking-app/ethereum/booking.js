import web3 from "./web3";
import contract from "../build/contracts/TimeTable.json";

const abi = contract["abi"];
const networks = contract["networks"];
const address = networks[Object.keys(networks)[0]]["address"];

console.log("Address of the contract id", address);

export default new web3.eth.Contract(abi, address);
