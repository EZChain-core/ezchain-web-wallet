import Avalanche from 'ezchainjs2';
//@ts-ignore
import BinTools from 'ezchainjs2/dist/utils/bintools';
// Connect to TestNet by default
// Doesn't really matter how we initialize, it will get changed by the network module later
var ip = 'bootstrap.ava.network';
var port = 21000;
var protocol = 'https';
var network_id = 2;
var chain_id = 'X';
var bintools = BinTools.getInstance();
var ava = new Avalanche(ip, port, protocol, network_id, chain_id);
var avm = ava.XChain();
var cChain = ava.CChain();
var pChain = ava.PChain();
var infoApi = ava.Info();
var keyChain = avm.keyChain();
function isValidAddress(addr) {
    try {
        var res = bintools.stringToAddress(addr);
        return true;
    }
    catch (err) {
        return false;
    }
}
export { ava, avm, pChain, cChain, infoApi, bintools, isValidAddress, keyChain };
//# sourceMappingURL=AVA.js.map