const {ethers} = require('hardhat')
const {expect} = require('chai')

const tokens = (n) => {
  return ethers.utils.parseEther(n.toString())

}

describe('Token', async () => {
  let token
  const name = 'Snarfcoin'
  const symbol = 'SNARF'
  const totalSupply = tokens(1000000)

  beforeEach(async () => {
  
  const Token = await ethers.getContractFactory('Token')
  token = await Token.deploy('Snarfcoin', 'SNARF', tokens(1000000))
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
  })
  
  
})
