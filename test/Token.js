const { ethers } = require('hardhat')
const { expect } = require('chai')
const { result } = require('lodash')

const tokens = (n) => {
  return ethers.utils.parseEther(n.toString())
}

describe('Token', async () => {

  let token, accounts, deployer
  const name = 'Snarfcoin'
  const symbol = 'SNARF'
  const totalSupply = tokens(1000000)

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Snarfcoin', 'SNARF', tokens(1000000))
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
    exchange = accounts[2]
  })

  describe('Deployment', async () => {

    it('has the right name', async () => {
      expect(await token.name()).to.equal(name)
    })
    it('has the right symbol', async () => {
      expect(await token.symbol()).to.equal(symbol)
    })
    it('has the correct decimals', async () => {
      expect(await token.decimals()).to.equal(18)
    })
    it('has the correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply)
    })
    it('assigns the total supply to the deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })
  })
  describe('Simple Transfer', async () => {

    let transaction, result, event

    beforeEach(async () => {
      transaction = await token.connect(deployer).transfer(receiver.address, tokens(100))
      result = await transaction.wait()
      event = result.events[0]
    })
    describe('Success', async () => {

      it('transfers correct amounts between accounts', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(tokens(100))
      })
      it('emits a correct transfer event', async () => {
        expect(event.event).to.equal('Transfer')
        expect(event.args[0]).to.equal(deployer.address)
        expect(event.args[1]).to.equal(receiver.address)
        expect(event.args.amount).to.equal(tokens(100))
      })
    })
    describe('Failure', async () => {

      it('rejects insufficient balances', async () => {
        const invalidTransaction = token.connect(receiver).transfer(deployer.address, tokens(1000))
        expect(invalidTransaction).to.be.revertedWith('ERC20: transfer amount exceeds balance')
      })
      it('rejects invalid recipients', async () => {
        const invalidTransaction = token.connect(deployer).transfer(ethers.constants.AddressZero, tokens(100))
        expect(invalidTransaction).to.be.revertedWith('ERC20: transfer to the zero address')
      })
      it('rejects transfers from the zero address', async () => {
        const invalidTransaction = token.connect(ethers.constants.AddressZero).transfer(receiver.address, tokens(100))
        expect(invalidTransaction).to.be.revertedWith('ERC20: transfer from the zero address')
      })
      it('rejects invalid amounts', async () => {
        const invalidTransaction = token.connect(deployer).transfer(receiver.address, 0)
        expect(invalidTransaction).to.be.revertedWith('ERC20: transfer amount must be greater than zero')
      })
    })
  })


  describe('Approvals', async () => {

    let transaction, result, event

    beforeEach(async () => {
      transaction = await token.connect(deployer).approve(exchange.address, tokens(100))
      result = await transaction.wait()
    })
    describe('Success', async () => {

      it('allocates an allowance for delegated token spending on an exchange', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(tokens(100))
      })
      it('emits a correct approval event', async () => {
        event = result.events[0]
        expect(event.event).to.equal('Approval')
        expect(event.args[0]).to.equal(deployer.address)
        expect(event.args[1]).to.equal(exchange.address)
        expect(event.args.value).to.equal(tokens(100))
      })

      describe('Failure', async () => {

        it('rejects invalid recipients', async () => {
          const invalidTransaction = token.connect(deployer).approve(ethers.constants.AddressZero, tokens(100))
          expect(invalidTransaction).to.be.revertedWith('ERC20: approve to the zero address')
        })
        it('rejects invalid amounts', async () => {
          const invalidTransaction = token.connect(deployer).approve(exchange.address, 0)
          expect(invalidTransaction).to.be.revertedWith('ERC20: approve amount must be greater than zero')
        })
      })
    })
  })


  describe('Delegated Transfer', async () => {

    beforeEach(async () => {
      await token.connect(deployer).approve(exchange.address, tokens(100))
    })
    describe('Success', async () => {

      let transaction, result, event

      beforeEach(async () => {
        transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, tokens(100))
        result = await transaction.wait()
        event = result.events[0]
      })
      it('transfers correct amounts between accounts', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(tokens(100))
      })
      it('resets the allowance(before/after)', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(0)
      })
      it('emits a correct transfer event', async () => {
        expect(event.event).to.equal('Transfer')
        expect(event.args[0]).to.equal(deployer.address)
        expect(event.args[1]).to.equal(receiver.address)
        expect(event.args.amount).to.equal(tokens(100))
      })
    })
    describe('Failure', async () => {

      it('doesnt transfer too many tokens', async () => {
        invalidAmount = tokens(10000000000)
        await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
      })
    })
  })
})

