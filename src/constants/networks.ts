import abiTestToken from '../abi/TESTERC20.json'

export type Tokens = { [key:string]: string }
type Pairs = { [key:string]: Array<string> }
type TokensABIs = { [key:string]: any }

export type Network = {
  tokens:Tokens,
  name:string,
  contract:string,
}

export type Networks = {
  [key:string]: Network,
}

// each network has specific set of tokens
export const networks:Networks = {
  '80001': {
    name: 'sidechain',
    contract: '0xdf3786659dc64e343fFED27eD213Ed6138834B19',
    tokens: {
      '0x0000000000000000000000000000000000000000': 'ETH',
      '0x928a67f1ad0716fb6c24d57770f843ee06b9ebc1': 'NDT',
      '0x0000000000000000000000000000000000001010': 'MATIC',
      '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e': 'ERC20T',
      '0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62': 'WETH',
      '0x33FC58F12A56280503b04AC7911D1EceEBcE179c': 'ERC721T',
      '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323': 'WETHPoS',
      '0x82b817afaa09a34ae381adf0773395d885c98797': 'UFT',
    }
  }
}

// address to symbol translation
export type AllTokens = { [key:string]: { [key:string]: string }}

export const allTokensAddresses:AllTokens = {}

Object.keys(networks).forEach((chainID:string) => {
  const tokens = networks[chainID].tokens

  Object.keys(tokens).forEach(tokenAddress => {
    allTokensAddresses[tokenAddress.toUpperCase()] = {
      token: tokens[tokenAddress],
      networkName: networks[chainID].name,
    }
  })
})

export const quoteCurrencies = [ 'ETH', 'DAI' ]

export const tokenNames:Tokens = {
  UFT: 'Unidentified Flying Token',
  ETH: 'Ethereum',
  NDT: 'Non Disclosed Token',
  MATIC: 'Matic',
  ERC20T: 'ERC20 Test token',
  WETH: 'WETH',
  ERC721T: 'ERC721 Test Token',
  WETHPoS: 'WETHPoS',
}

export const tokenABIs:TokensABIs = {
  ERC20T: abiTestToken,
}

export const getTokenNameFromAddress = (tokenAddress:string) =>
  tokenAddress.toUpperCase() in allTokensAddresses ?
    allTokensAddresses[tokenAddress.toUpperCase()].token : '???'

export const getNetworkNameFromAddress = (tokenAddress:string) =>
  tokenAddress.toUpperCase() in allTokensAddresses ?
    allTokensAddresses[tokenAddress.toUpperCase()].networkName : '???'

export const getTokenAddressFromName = (tokenName:string, network:Network) =>
  Object.keys(network.tokens).find(address => network.tokens[address] === tokenName)
