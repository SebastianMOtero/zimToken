const ZimToken = artifacts.require("ZimToken");

contract("ZimToken", () => {

    before(async () => {
        this.zimToken = await ZimToken.deployed();
        this.accounts = await web3.eth.getAccounts();
    })

    it('Migrate deployed successfully', async () => {
        const address = this.zimToken.address;
        const zimTokenInstance = await this.zimToken;
        
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.equal(typeof address, 'string');
        assert.equal(await zimTokenInstance.name(), "Zim Token");
        assert.equal(await zimTokenInstance.symbol(), 'ZT');
        assert.equal(await zimTokenInstance.decimals(), 10);
        assert.equal(await zimTokenInstance.totalSupply(), 100 * (10 ** await zimTokenInstance.decimals()));
        assert.equal((await zimTokenInstance.balanceOf(this.accounts[0])).toNumber(), await zimTokenInstance.totalSupply())
    })

    it('Make a transfer successfully', async () => {
        const valueToTransfer = 100;
        const result = await this.zimToken.transfer(this.accounts[1], valueToTransfer);

        assert.equal((await this.zimToken.balanceOf(this.accounts[0])).toNumber(), (await this.zimToken.totalSupply() - valueToTransfer));
        assert.equal((await this.zimToken.balanceOf(this.accounts[1])).toNumber(), valueToTransfer);
        assert.equal(this.accounts[0], result.logs[0].args[0]);
        assert.equal(this.accounts[1], result.logs[0].args[1]);
        assert.equal(valueToTransfer, result.logs[0].args[2].toNumber());
    })

    it('Approve another wallet', async () => {
        const valueApproved = 200;
        const result = await this.zimToken.approve(this.accounts[2], valueApproved);

        assert.equal((await this.zimToken.allowance(this.accounts[0], this.accounts[2])).toNumber(), valueApproved);
        assert.equal(this.accounts[0], result.logs[0].args[0]);
        assert.equal(this.accounts[2], result.logs[0].args[1]);
        assert.equal(valueApproved, result.logs[0].args[2].toNumber());
    })
})