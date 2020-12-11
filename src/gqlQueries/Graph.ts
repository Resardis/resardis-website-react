import { gql } from "@apollo/client"

export const getDataSeries = (timeResolution:string, tokenAddress:string) => {
  const GET_MIN_MAX = `
    query getMinMax {
      pairTimeDatas(where:{timeDataType: "${timeResolution}", buyGem: "${tokenAddress}"}) {
        buyAmt
        buyGem
        openBuyOverPay
        openPayOverBuy
        closeBuyOverPay
        closePayOverBuy
        minBuyOverPay
        minPayOverBuy
        maxBuyOverPay
        maxPayOverBuy
        payAmt
        payGem
        startUnix
        timeDataType
        tradeCount
      }
  }`

  return gql(GET_MIN_MAX)
}
