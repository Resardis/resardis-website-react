import { BigNumber } from 'bignumber.js'

export const numberB4DP = (number:BigNumber) => number.toNumber().toFixed(4)

export const number4DP = (number:number) => {
  if (Number(number) > 1000000) return Number(number).toFixed(0)
  if (Number(number) > 10000) return Number(number).toFixed(2)
  if (Number(number) > 100) return Number(number).toFixed(4)
  if (Number(number) > 1) return Number(number).toFixed(6)
  return Number(number).toFixed(8)
}

export const wei2ether = (big:BigNumber, fixed:number = 4):string => big.div(1e+18).toFixed(fixed)
