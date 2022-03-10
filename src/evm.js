import Web3 from 'web3';
import ERC721Abi from '@openzeppelin/contracts/build/contracts/ERC721.json';
import ERC20Abi from '@openzeppelin/contracts/build/contracts/ERC20.json';
var abiDecoder = require('abi-decoder'); // NodeJS
abiDecoder.addABI(ERC721Abi.abi);
abiDecoder.addABI(ERC20Abi.abi);
var rpcUrl = "https://api.avax.network/ext/bc/C/rpc";
var web3 = new Web3(rpcUrl);
export { web3, abiDecoder };
//# sourceMappingURL=evm.js.map