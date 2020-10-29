import React from 'react'
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import moment from 'moment'
import '../css/SelectedMarket.css'
import { Network } from '../constants/networks'
import { getTrades } from '../gqlQueries/SelectedMarket'
import { BigNumber } from 'bignumber.js'
import { TradeType } from '../constants/marketTypes'
import { wei2ether } from '../helpers'

interface OrdersProps {
  selectedCurrencyPair: string,
  network: Network,
}

const History = ({ selectedCurrencyPair, network }:OrdersProps) => {
  let { loading, error, data } = useQuery(getTrades(selectedCurrencyPair, network), { pollInterval: 1000 })

    if (loading) return <span>Loading...</span>
    if (error) {
      console.log(error.message)
      return <span>Error!</span>
    }

    const trades = data.trades.map((trade:TradeType) => {
      const buyAmt = new BigNumber(trade.buyAmt)
      const payAmt = new BigNumber(trade.payAmt)
      let color
      let price:BigNumber
      let amount:BigNumber

      if (trade.buyGem === ethers.constants.AddressZero) {
        price = buyAmt.div(payAmt)
        amount = payAmt
        color = 'red'
      } else {
        price = payAmt.div(buyAmt)
        color = 'green'
        amount = buyAmt
      }
      let ts = moment.unix(trade.timestamp).format("YY-MM-DD HH:mm")

      return (
        <tr style={{ color: color }}>
          <td>{wei2ether(price)}</td>
          <td>{wei2ether(amount)}</td>
          <td>{ts}</td>
        </tr>
      )
    })

  return <>
    <table className="table table-borderless table-dark table-hover table-sm">
      <thead>
        <tr>
          <th scope="col">Price</th>
          <th scope="col">Amount</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {trades.length ? trades : (
          <tr className="text-center text-capitalize">
            <td colSpan={3}>no trades found</td>
          </tr>
        )}
      </tbody>
    </table>
  </>
}


export default History
