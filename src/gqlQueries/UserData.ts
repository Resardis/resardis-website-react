import { gql } from "@apollo/client"

export const getMyOrders = (address:string) => {
  const GET_MY_ORDERS = `
  query GetMyOrders {
    makes (where:{maker:"${address}"}) {
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

  return gql(GET_MY_ORDERS)
}

export const getMyOrderTakes = (offerID:number) => {
  const GET_TAKES = `
  query GetMyOffersTakes {
    takes (where:{offerID:${offerID}}) {
      offerID
      payGem
      giveAmt
      buyGem
      takeAmt
    }
  }`

  return gql(GET_TAKES)
}

export const getMyTrades = (address:string) => {
  const GET_MY_TRADES = `
  query GetMyTrades {
    makes (where:{maker:"${address}"}) {
      id
      payGem
      payAmt
      buyGem
      buyAmt
      timestamp
    }
    takes (where:{taker:"${address}"}) {
      id
      payGem
      giveAmt
      buyGem
      takeAmt
      timestamp
    }
  }`

  return gql(GET_MY_TRADES)
}
