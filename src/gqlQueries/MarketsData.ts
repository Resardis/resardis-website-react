import { gql } from "@apollo/client"

export const getPairs = (last24Start:number, prev24Start:number, prev24End:number) => {
  const GET_PAIRS = `
  query GetPairs {
    last24takes: takes(where: { timestamp_gt: "${last24Start}" } orderBy: timestamp orderDirection: desc) {
      payGem
      buyGem
      takeAmt
      giveAmt
      timestamp
    }
    prev24takes:takes (where: { timestamp_gt: "${prev24Start}", timestamp_lt: "${prev24End}" } orderBy: timestamp orderDirection: desc) {
      takeAmt
      giveAmt
      payGem
      buyGem
    }
  }`

  return gql(GET_PAIRS)
}
