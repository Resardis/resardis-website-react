import { gql } from "@apollo/client"

export const getMyDeposits = (address:string) => {
  const GET_MY_DEPOSITS = `
  query GetMyDeposits {
    deposits (where:{user:"${address}"}) {
      id
      token
      user
      amount
      balance
    }
    withdraws (where:{user:"${address}"}) {
      id
      token
      user
      amount
      balance
    }
  }`

  return gql(GET_MY_DEPOSITS)
}
