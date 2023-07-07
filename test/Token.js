const {ethers} = require('hardhat')
const {expect} = require('chai')

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
  describe('Transactions', async () => {
    it('transfers tokens between accounts', async () => {
      await token.transfer(accounts[1].address, tokens(100))
      expect(await token.balanceOf(accounts[1].address)).to.equal(tokens(100))
    })
    it('does not transfer tokens if the sender does not have enough', async () => {
      await expect(token.connect(accounts[1]).transfer(deployer.address, tokens(100)))
      .to.be.revertedWith('Not enough tokens')
    })
  })
})

