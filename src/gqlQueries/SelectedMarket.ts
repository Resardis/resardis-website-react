import { gql } from "@apollo/client"
import { Network, getTokenAddressFromName } from '../constants/networks'

export const getPairMakes = (pair:string) => {
  const GET_PAIR_MAKES = `
    query GetMakes {
      makes(orderBy: timestamp orderDirection: desc where:{pair:"${pair}"}) {
        offerID
        pair
        maker
        payGem
        payAmt
        buyGem
        buyAmt
        timestamp
        offerType
      }
    }`

  return gql(GET_PAIR_MAKES)
}

export const getPairMakesSells = (selectedCurrencyPair:string, network:Network) => {
  const [ baseCurrency, quoteCurrency ] = selectedCurrencyPair.split('/')

  const baseToken = getTokenAddressFromName(baseCurrency, network)
  const quoteToken = getTokenAddressFromName(quoteCurrency, network)

  const GET_PAIR_MAKES = `
    query GetMakes {
      makes(orderBy: timestamp orderDirection: desc where:{
        payGem: "${baseToken}",
        buyGem: "${quoteToken}"
      }) {
        offerID
        maker
        payGem
        payAmt
        buyGem
        buyAmt
        timestamp
        offerType
      }
    }`

  return gql(GET_PAIR_MAKES)
}

export const getPairMakesBuys = (selectedCurrencyPair:string, network:Network) => {
  const [ baseCurrency, quoteCurrency ] = selectedCurrencyPair.split('/')

  const baseToken = getTokenAddressFromName(baseCurrency, network)
  const quoteToken = getTokenAddressFromName(quoteCurrency, network)

  const GET_PAIR_MAKES = `
    query GetMakes {
      makes(orderBy: timestamp orderDirection: desc where:{
        payGem: "${quoteToken}",
        buyGem: "${baseToken}"
      }) {
        offerID
        maker
        payGem
        payAmt
        buyGem
        buyAmt
        timestamp
        offerType
      }
    }`

  return gql(GET_PAIR_MAKES)
}

export const getPairTakes = (pair:string) => {
  const GET_PAIR_TAKES = `
    query GetTakes {
      takes(orderBy: timestamp orderDirection: desc where:{pair:"${pair}"}) {
        offerID
        pair
        maker
        payGem
        buyGem
        taker
        takeAmt
        giveAmt
        timestamp
        offerType
      }
    }`

  return gql(GET_PAIR_TAKES)
}

export const getTrades = (selectedCurrencyPair:string, network:Network) => {
  const [ baseCurrency, quoteCurrency ] = selectedCurrencyPair.split('/')

  const token1 = getTokenAddressFromName(baseCurrency, network)
  const token2 = getTokenAddressFromName(quoteCurrency, network)

  const GET_TRADES = `
    query GetTakes {
      trades(orderBy: timestamp orderDirection: desc where: {
        payGem_in: ["${token1}","${token2}"],
        buyGem_in: ["${token1}","${token2}"]
      }) {
        payGem
        payAmt
        buyGem
        buyAmt
        timestamp
      }
    }`

  return gql(GET_TRADES)
}
