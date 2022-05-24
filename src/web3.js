import Web3 from 'web3';
let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://speedy-nodes-nyc.moralis.io/7ff0e77e3e4eb865ff0a8a3a/eth/goerli'
    );
    web3 = new Web3(provider);
}
export default web3;