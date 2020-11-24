import abiTestToken from '../abi/TESTERC20.json'

export type Tokens = { [key:string]: string }
type TokensABIs = { [key:string]: any }

export type Network = {
  tokens:Tokens,
  name:string,
  contract:string,
}

export type Networks = {
  [key:string]: Network,
}

// https://docs.matic.network/docs/develop/network-details/mapped-tokens
// MATIC	Plasma	          0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae	0x0000000000000000000000000000000000001010
// ERC20-TestToken	Plasma	0x3f152B63Ec5CA5831061B2DccFb29a874C317502	0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e
// Plasma-WETH	Plasma	    0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc	0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62
// ERC721-TestToken	Plasma	0xfA08B72137eF907dEB3F202a60EfBc610D2f224b	0x33FC58F12A56280503b04AC7911D1EceEBcE179c
// PoS-WETH	PoS	          0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc	0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
// DummyERC20Token	PoS   	0x655F2166b0709cd575202630952D71E2bB0d61Af	0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1
// DummyERC721Token	PoS	  0x084297B12F204Adb74c689be08302FA3f12dB8A7	0x757b1BD7C12B81b52650463e7753d7f5D0565C0e
// DummyERC1155Token	PoS	  0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063	0xA07e45A987F19E25176c877d98388878622623FA

export const networks:Networks = {
  '80001': {
    name: 'sidechain',
    // contract: '0xdf3786659dc64e343fFED27eD213Ed6138834B19',
    contract: '0x62069B20F297AB15236A30489ec8DC4b44D4ca61',
    tokens: {
      '0x0000000000000000000000000000000000000000': 'ETH',
//      '0x928a67f1ad0716fb6c24d57770f843ee06b9ebc1': 'ERCX',
      '0x3fe5dc553137b66335d5bf806a3f47ef89a6512a': 'ERCX',
      '0x0000000000000000000000000000000000001010': 'MATIC', // Plasma
      '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e': 'ERC20T', //Plasma
      '0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62': 'WETH', // Plasma
      '0x33FC58F12A56280503b04AC7911D1EceEBcE179c': 'ERC721T', // Plasma
      '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323': 'WETHPoS',
      '0x82b817afaa09a34ae381adf0773395d885c98797': 'UFT',
      '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1': 'DERC20', // PoS
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
  ERCX: 'ERCX Token',
  MATIC: 'Matic',
  ERC20T: 'ERC20 Test token',
  WETH: 'WETH',
  ERC721T: 'ERC721 Test Token',
  WETHPoS: 'WETHPoS',
  DERC20: 'DummyERC20Token PoS',
}

export const tokenABIs:TokensABIs = {
  ERC20T: abiTestToken,
}

export const getTokenNameFromAddress = (tokenAddress:string) => {
//  console.log('getTokenNameFromAddress', tokenAddress.toUpperCase(), allTokensAddresses)
  return tokenAddress.toUpperCase() in allTokensAddresses ? allTokensAddresses[tokenAddress.toUpperCase()].token : '???'
}

export const getNetworkNameFromAddress = (tokenAddress:string) =>
  tokenAddress.toUpperCase() in allTokensAddresses ?
    allTokensAddresses[tokenAddress.toUpperCase()].networkName : '???'

export const getTokenAddressFromName = (tokenName:string, network:Network) =>
  Object.keys(network.tokens).find(address => network.tokens[address] === tokenName)

export const getSelectedCurrencyTokenPair = (selectedCurrencyPair:string, network:Network) => {
  const [ baseCurrency, quoteCurrency ] = selectedCurrencyPair.split('/')

  return [
    Object.keys(network.tokens).find(address => network.tokens[address] === baseCurrency) || '',
    Object.keys(network.tokens).find(address => network.tokens[address] === quoteCurrency) || '',
  ]
}
