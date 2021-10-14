import abiTestToken from "../abi/TESTERC20.json";

export type Tokens = { [key: string]: string };
type Pairs = { [key: string]: Array<string> };
type TokensABIs = { [key: string]: any };

export type Network = {
  tokens: Tokens;
  name: string;
  contract: string;
};

export type Networks = {
  [key: string]: Network;
};

// each network has specific set of tokens
export const networks: Networks = {
  "80001": {
    name: "sidechain",
    contract: "0x8B89359a48C153994d2A6BF878b148f151d2A0c4",
    tokens: {
      "0x08F53Ca52B5e369932BD417a24902E70aF2c87a1": "ETH",
      "0xe8b8fe9ed674974c53877239990156633fa8c440": "LEND",
      "0xD9bc1608ba4B8C07e290F4c37996b3681b07BD67": "RSD",
      "0xdb14cC1e4DFFeDc725c3EB30BA7a133492f0a9E9": "AAA",
      "0x8f314e7B44aDc288EfAEEc6bad987a580088f6B8": "BBB",
    },
  },
};

// address to symbol translation
export type AllTokens = { [key: string]: { [key: string]: string } };

export const allTokensAddresses: AllTokens = {};

Object.keys(networks).forEach((chainID: string) => {
  const tokens = networks[chainID].tokens;

  Object.keys(tokens).forEach((tokenAddress) => {
    allTokensAddresses[tokenAddress.toUpperCase()] = {
      token: tokens[tokenAddress],
      networkName: networks[chainID].name,
    };
  });
});

export const quoteCurrencies = ["ETH"];

export const tokenNames: Tokens = {
  ETH: "Ethereum",
  LEND: "LEND",
  RSD: "RSD",
  AAA: "AAA",
  BBB: "BBB",
};

export const tokenABIs: TokensABIs = {
  ERC20T: abiTestToken,
};

export const getTokenNameFromAddress = (tokenAddress: string) =>
  tokenAddress.toUpperCase() in allTokensAddresses
    ? allTokensAddresses[tokenAddress.toUpperCase()].token
    : "???";

export const getNetworkNameFromAddress = (tokenAddress: string) =>
  tokenAddress.toUpperCase() in allTokensAddresses
    ? allTokensAddresses[tokenAddress.toUpperCase()].networkName
    : "???";

export const getTokenAddressFromName = (tokenName: string, network: Network) =>
  Object.keys(network.tokens).find(
    (address) => network.tokens[address] === tokenName
  );
