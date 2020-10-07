import { gql } from "@apollo/client"

export const getPairMakes = (pair:string) => {
  const GET_PAIR_MAKES = `
    query GetMakes {
      makes(where:{pair:"${pair}"}) {
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
