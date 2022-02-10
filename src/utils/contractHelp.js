import simpleRpcProvider from '@/utils/provider';
import crowdfunding from '@/abis/crowdfunding.json';



const addresses = {
    crowdfundingContract: '0xEEE1A17b52799DC4eB76E16829BC4b9C7BAB5BBF',

}

const getContract = (abi, address, provider) => {
    const signerOrProvider = provider ? provider : simpleRpcProvider;
    return new signerOrProvider.eth.Contract(abi, address);
};


export const getCrowdfundingContract = provider => {
    return getContract(crowdfunding, addresses.crowdfundingContract, provider);
};