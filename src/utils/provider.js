import Web3 from 'web3';


const simpleRpcProvider = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));

export default simpleRpcProvider;