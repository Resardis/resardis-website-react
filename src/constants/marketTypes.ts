import { BigNumber } from 'bignumber.js'

export type TradeType = {
  timestamp: number,
  payGem:string,
  buyGem:string,
  payAmt:BigNumber,
  buyAmt:BigNumber,
}
