const Block = require("./block");
const Blockchain = require("./blockchain");

describe("Blockchain", () => {
    let blockchain, newBlockchain, originalChain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newBlockchain = new Blockchain();
    });
    it("Contains a `chain` Array instance", () => {
        expect(blockchain.chain instanceof Array).toEqual(true);
    });
    it("Starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    it("Adds a new block to the chain", () => {
        const newData = "foo bar";
        blockchain.addBlock({data: newData});
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });
    describe("isValidChain()", () => {
        describe("When the chain doesn't start with genesis block", () => {
            it("Returns false", () => {
                blockchain.chain[0] = {data: "fake-genesis"};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe("When the chain start with genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock({data: "one"});
                blockchain.addBlock({data: "two"});
                blockchain.addBlock({data: "three"});
            });
            describe("And a lastHash reference has changed", () => {
                it("Returns false", () => {
                    blockchain.chain[2].lastHash = "broken-lastHash";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe("And the chain contains a block with an invalid field", () => {
                it("Returns false", () => {
                    blockchain.chain[2].data = "changed data";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe("And the chain doesn't contain any invalid blocks", () => {
                it("Returns true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    describe("replaceChain()", () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.spyOn(console, "error").mockImplementation();
            logMock = jest.spyOn(console, "log").mockImplementation();
        });
        describe("When the new chain is not longer", () => {
            beforeEach(() => {
                blockchain.addBlock({data: "one"});
                originalChain = JSON.parse(JSON.stringify(blockchain.chain));
                blockchain.replaceChain(newBlockchain.chain);
            });
            it("Does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it("Logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe("When the new chain is longer", () => {
            beforeEach(() => {
                newBlockchain.addBlock({data: "one"});
                newBlockchain.addBlock({data: "two"});
                newBlockchain.addBlock({data: "three"});
                originalChain = JSON.parse(JSON.stringify(blockchain.chain));
            });
            describe("And the new chain is invalid", () => {
                beforeEach(() => {
                    newBlockchain.chain[2].hash = "fake-hash";
                    blockchain.replaceChain(newBlockchain.chain);
                });
                it("Does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("Logs an error", () => {
                    expect(errorMock).toHaveBeenCalledWith("Received chain is not valid.");
                });
            });
            describe("And the new chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newBlockchain.chain);
                })
                it("Replaces the chain", () => {
                    expect(blockchain.chain).toEqual(newBlockchain.chain);
                });
                it("Logs a message", () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});
