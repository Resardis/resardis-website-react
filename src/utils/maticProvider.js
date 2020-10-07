import Matic from '@maticnetwork/maticjs'
import { ethers } from 'ethers'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const matic = new Matic({
  network: 'testnet',
  version: 'mumbai',
  maticProvider: provider,
  parentProvider: provider,
  parentDefaultOptions: {},
  maticDefaultOptions: {},
})


matic.initialize()

matic.balanceOfERC20(
  '0x2381Fb72794e403f223fBE614E495d6901307e48', //User address
  '0x2d7882bedcbfddce29ba99965dd3cdf7fcb10a1e',

).then(console.log)

export { matic }