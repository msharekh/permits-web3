const Permition = artifacts.require("Permition");

contract("Permition", (accounts) => {
    let permitOwner;
    let expectedPermitOwner;

    before(async () => {
        permition = await Permition.deployed();
    });

    describe("Permiting a permit and retrieving account addresses", async () => {
        before("Permiting a permit using accounts[0]", async () => {
            console.log('acc 0: ' + accounts[0]);
            await permition.permit(8, { from: accounts[0] });
            expectedPermitOwner = accounts[0];
            console.log('expectedPermitOwner: ' + accounts[0]);
        });

        it("can fetch the address of an owner by Permit id", async () => {
            const permitOwner = await permition.permitOwners(8);
            assert.equal(permitOwner, expectedPermitOwner, "The owner of the permited permit should be the first account.");
        });

        it("can fetch the collection of all permit owners' addresses", async () => {
            const permitOwners = await permition.getPermitOwners();
            console.log(permitOwners);
            assert.equal(permitOwners[8], expectedPermitOwner, "The owner of the permit should be in the collection.");
        });
    });

});
