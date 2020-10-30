import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BigNumber } from 'bignumber.js'
import { wei2ether } from '../helpers'
import { ethers } from 'ethers'
import { TradeType } from '../constants/marketTypes'
import { getPairMakesBuys, getPairMakesSells } from '../gqlQueries/SelectedMarket'
import { Network } from '../constants/networks'

interface OrdersProps {
  selectedCurrencyPair: string,
  network: Network,
}

type OrderType = {
  offerID: number,
  price: BigNumber,
  amountB: BigNumber,
  amountQ: BigNumber,
  // positional, depending on position after sorting by price
  avgPriceSoFar: BigNumber,
  amountSoFar: BigNumber,
  totalSoFar: BigNumber,
}

type Colors = { [key:string]: string }
const colors:Colors = {
  red: '#72383D',
  lightred: '#B7323C',
  green: '#0C583F',
  lightgreen: '#00734A',
}

const orderRowBackgroudColor = (order:OrderType, total: BigNumber, color:string) => {
  const part = order.amountB.div(total).multipliedBy(100).toNumber()
  const sum = order.totalSoFar.div(total).multipliedBy(100).toNumber()
  //console.log(part, sum, order[2].toString(), totalSoFar.toString(), total)

  return {
    background: `linear-gradient(90deg, ${colors[color]} ${part}%, ${colors[color]} ${sum}%, #454849 ${sum}%`,
    borderBottom: '1px solid #444849',
  }
}

type OrdersData = { [key:string]: OrderType }

interface OrderRowProps {
  order: OrderType,
  color: string,
  total: BigNumber,
  rowIndex: number,
  addLegend: boolean,
  setHighlightFrom: Function,
}
const OrderRow = ({ order, total, rowIndex, color, addLegend, setHighlightFrom }:OrderRowProps) => {
  const [ showContent, setShowContent ] = useState(false)

  return (
  <tr style={orderRowBackgroudColor(order, total, color)}
    onMouseEnter={() => {
      setHighlightFrom(rowIndex)
      setShowContent(true)
    }}
    onMouseLeave={() => {
      setShowContent(false)
    }}
  >
    <td style={{ marginBottom: '1px' }}>
      {(addLegend || showContent) ? (
        <div className="depth-line-container align-items-center justify-content-center" style={{ height: '10px' }}>
          {showContent ? (
            <span>Avg. price: {wei2ether(order.avgPriceSoFar, 6)}, Amount: {wei2ether(order.amountSoFar)}, Total:{wei2ether(order.totalSoFar)} </span>
          ) : (
            <span>{wei2ether(order.totalSoFar)}</span>
          )}
        </div>
      ) : (
        <div style={{ height: '10px' }}></div>
      )}
    </td>
  </tr>
)}

interface OrdersTableProps {
  orders: OrdersData,
  total: BigNumber,
  reverse: boolean,
  colorBar: string,
  colorBarLight: string,
}
const OrdersTable = ({ orders, total, reverse, colorBar, colorBarLight }:OrdersTableProps) => {
  const [ highlightFrom, setHighlightFrom ] = useState(-1)

  let totalSoFar:BigNumber = new BigNumber(0)
  let priceSoFar:BigNumber = new BigNumber(0)
  let amountSoFar:BigNumber = new BigNumber(0)

  const orderRows = Object.keys(orders)
  .sort((a, b) => orders[a].price.gt(orders[b].price) ? -1 : 1)
  .map((priceIndex, rowIndex) => {
    // calculate avg price and total first
    const order = orders[priceIndex]
    order.totalSoFar = totalSoFar = totalSoFar.plus(order.amountB)
    order.amountSoFar = amountSoFar = amountSoFar.plus(order.amountQ)
    priceSoFar = priceSoFar.plus(order.price)
    order.avgPriceSoFar = rowIndex ? priceSoFar.div(rowIndex) : order.price
    return priceIndex
  })
  .map((priceIndex, rowIndex) => {
    const order = orders[priceIndex]
    return <OrderRow
      key={priceIndex}
      order={order}
      total={total}
      rowIndex={rowIndex}
      color={highlightFrom >= rowIndex ? colorBarLight : colorBar}
      addLegend={rowIndex === Object.keys(orders).length -1}
      setHighlightFrom={setHighlightFrom}
    />
  })

  return (
  <table className="table table-borderless table-dark table-striped table-hover table-sm market-orders-content">
    <tbody>
      {reverse ? orderRows.reverse() : orderRows}
    </tbody>
  </table>
)}

const NoOrdersTable = () => (
  <table className="table table-borderless table-dark table-striped table-hover table-sm market-orders-content">
    <tbody>
      <tr>
        <td>no orders found</td>
      </tr>
    </tbody>
  </table>
)

const getPrice = (trade:TradeType) => {
  const buyAmt = new BigNumber(trade.buyAmt)
  const payAmt = new BigNumber(trade.payAmt)

  if (trade.buyGem === ethers.constants.AddressZero) return buyAmt.div(payAmt)
  return payAmt.div(buyAmt)
}

const processOrders = (data:any) => {
  const orders:OrdersData = {}
  let total:BigNumber = new BigNumber(0)
  let price:BigNumber
  let priceIndex:string
  let amountB:BigNumber
  let amountQ:BigNumber

  data.makes.forEach((order:any) => {
    if (order.buyGem === ethers.constants.AddressZero) {
      // SELL
      amountB = new BigNumber(order.buyAmt)
      amountQ = new BigNumber(order.payAmt)
    } else {
      amountQ = new BigNumber(order.buyAmt)
      amountB = new BigNumber(order.payAmt)
    }

    // [ price, amount, part of total sum ]
    price = amountB.div(amountQ)
    total = total.plus(amountB)
    priceIndex = price.toString()

    if (priceIndex in orders) {
      orders[priceIndex].amountQ = orders[priceIndex].amountQ.plus(amountQ)
      orders[priceIndex].amountB = orders[priceIndex].amountB.plus(amountB)
    } else {
      orders[priceIndex] = {
        price,
        amountQ,
        amountB,
        offerID: order.offerID,
        avgPriceSoFar: new BigNumber(0),
        totalSoFar: new BigNumber(0),
        amountSoFar: new BigNumber(0)
      }
    }
  })

  return { orders, total }
}

const Depth = ({
  selectedCurrencyPair,
  network,
}:OrdersProps) => {
  let { loading:l1, error:e1, data:d1 } = useQuery(getPairMakesSells(selectedCurrencyPair, network), { pollInterval: 1000 })
  let { loading:l2, error:e2, data:d2 } = useQuery(getPairMakesBuys(selectedCurrencyPair, network), { pollInterval: 1000 })

  if (l1 || l2) return <span>Loading...</span>
  if (e1 || e2) {
    console.log(e1 ? e1.message : e2 ? e2.message : '')
    return <span>Error!</span>
  }

  const { orders:sellOrders, total:totalSell } = processOrders(d1)
  const { orders:buyOrders, total:totalBuy } = processOrders(d2)

  if (!Object.keys(sellOrders).length && !Object.keys(buyOrders).length) return (
    <NoOrdersTable />
  )

  return <>
    <div className="market-depth">
        <OrdersTable orders={sellOrders} total={totalSell} reverse={true} colorBar="red" colorBarLight="lightred" />
        <div className="depth-line-container align-items-center justify-content-center">
          <div className="depth-line"></div>
            0.0000
          <div className="depth-line"></div>
        </div>
        <OrdersTable orders={buyOrders} total={totalBuy} reverse={false} colorBar="green" colorBarLight="lightgreen" />
    </div>
  </>
}

export default Depth