const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const {timestamp, lastHash, hash, data} = block;
            if (lastHash !== actualLastHash) {
                return false;
            }
            if (cryptoHash(timestamp, lastHash, data) !== hash) {
                return false;
            }
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.error("Received chain is not longer than the current chain.");
            return;
        }
        if (!Blockchain.isValidChain(newChain)) {
            console.error("Received chain is not valid.");
            return;
        }
        console.log("Replacing chain with new chain:", newChain);
        this.chain = newChain;
    }
}

module.exports = Blockchain;