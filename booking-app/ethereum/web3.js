import Web3 from "web3";

// const infuraKey = "dfa42e01249b4a15b477718fc7aff9cb";
// const provider = new Web3.providers.WebsocketProvider(
//   "wss://ropsten.infura.io/ws/v3/" + infuraKey
// );
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
const web3 = new Web3(provider);

export default web3;
