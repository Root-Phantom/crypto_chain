const Block = require('./block');
const {GENESIS_DATA} = require("./config");
const cryptoHash = require("./crypto-hash");
describe("Block", () => {
    const timestamp = "122"
    const lastHash = "b"
    const hash = "c"
    const data = "d"
    const block = new Block({
        timestamp, lastHash, hash, data,
    });
    it("It has timestamp, lastHash, hash and data property.", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });
    describe("genesis()", () => {
        const genesisBlock = Block.genesis();
        it("Returns a block instance.", () => {
            expect(genesisBlock).toBeInstanceOf(Block);

        });
        it("Returns the genesis data.", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);

        });
    });

    describe('mineBlock()', () => {
        lastBlock = Block.genesis();
        const data = "mined data"
        const minedBlock = Block.mineBlock({lastBlock, data})
        it("Returns a block instance.", () => {
            expect(minedBlock).toBeInstanceOf(Block);
        });
        it("Sets the `lastHash` to the `hash` of lastBlock.", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it("Sets the `data`", () => {
            expect(minedBlock.data).toEqual(data);
        });
        it("Sets the `timestamp`", () => {
            expect(minedBlock.timestamp).toBeDefined();
        });
        it("Creates a SHA-256  `hash` based on the proper inputs", () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    });
});