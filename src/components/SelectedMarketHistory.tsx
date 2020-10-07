import React from 'react'
import { useQuery } from '@apollo/client'
import { tokenPairs } from '../constants/networks'
import { ethers, BigNumber } from 'ethers'
import moment from 'moment'
import '../css/SelectedMarket.css'
import { getPairTakes } from '../gqlQueries/SelectedMarket'

interface OrdersProps {
  selectedCurrencyPair: string,
}

const History = ({ selectedCurrencyPair }:OrdersProps) => {
  const pair = selectedCurrencyPair in tokenPairs ?
    tokenPairs[selectedCurrencyPair] : tokenPairs['TEST/ETH']

  const { loading, error, data } = useQuery(getPairTakes(pair))

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error! {error.message}</span>

  const orders = data.takes.map((order:any) => {
    const takeAmt = BigNumber.from(order.takeAmt)
    const giveAmt = BigNumber.from(order.giveAmt)

    const price = takeAmt.div(giveAmt)

    const color = (BigNumber.from(order.payGem).eq(BigNumber.from(0))) ? 'green' : 'red'

    let ts = moment.unix(order.timestamp).format("YYYY-MM-DD HH:mm")

    return (
      <tr style={{ color: color }}>
        <td>{ethers.utils.formatEther(price)}</td>
        <td>{ethers.utils.formatEther(takeAmt)}</td>
        <td>{ts}</td>
      </tr>
    )
  })

  return <>
    <table className="market-orders-history">
      <thead>
        <tr>
          <th>Price</th>
          <th>Amount</th>
          <th>Total</th>
        </tr>
      </thead>
    </table>
    <div className="container">
      <div className="container container-inner" style={{ margin: 0 }}>
        <div className="container-scroll" style={{ margin: 0 }}>
          <table>
            <tbody>
              {orders.length ? orders : (
                <tr>
                  <td colSpan={3}>no orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ minHeight: '12px' }}></div>
      </div>
    </div>
  </>
}


export default History
