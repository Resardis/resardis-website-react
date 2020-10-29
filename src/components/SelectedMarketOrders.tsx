import React from 'react'
import { ReactComponent as ArrowUp } from '../svg/arrow-up.svg'
import { ReactComponent as ArrowDown } from '../svg/arrow-down.svg'
import { useQuery } from '@apollo/client'
import { tokenPairs } from '../constants/networks'
import { BigNumber } from 'bignumber.js'
import { wei2ether } from '../helpers'
import { getPairMakes } from '../gqlQueries/SelectedMarket'

interface OrdersHeaderProps {
  baseCurrency: string,
  quoteCurrency: string,
}

interface OrdersProps {
  selectedCurrencyPair: string,
  baseCurrency: string,
  quoteCurrency: string,
}

const OrdersHeader = ({ baseCurrency, quoteCurrency }:OrdersHeaderProps) => (
  <thead>
    <tr>
      <th scope="col">Price</th>
      <th scope="col">Amount({baseCurrency})</th>
      <th scope="col">Total({quoteCurrency})</th>
    </tr>
  </thead>
)

type ColorTheme = { [key:string]: Array<[string, string, string]> }
const colorThemes:ColorTheme = {
  red: [
    [ '#B52F39', '#833A40', '#454849' ],
    [ '#B7323C', '#8F474D', '#5D6162'],
  ],
  green: [
    [ '#1A9150', '#2D704C', '#454849' ],
    [ '#1D9452', '#397D59', '#5D6162' ],
],
}

const orderRowBackgroudColor = (order:Array<BigNumber>, total: BigNumber, rowIndex:number, theme:string) => {
  const colors = colorThemes[theme][rowIndex%2]
  // [total / order[0]]  [total / order[1]]

  return {
    background: `linear-gradient(90deg, ${colors[0]} 21%, ${colors[1]} 21%, ${colors[1]} 48%, ${colors[2]} 48%`
  }
}

type OrdersData = { [key:string]: Array<BigNumber> }

interface OrdersTableProps {
  orders: OrdersData,
  color: string,
  total: BigNumber,
}
const OrdersTable = ({orders, color, total}:OrdersTableProps) => (
    <tbody>
      {Object.keys(orders)
      .sort((a, b) => orders[a][0].gt(orders[b][0]) ? 1 : -1)
      .map((priceIndex, i) => {
        const order = orders[priceIndex]

        return (
          <tr key={priceIndex} style={orderRowBackgroudColor(order, total, i, color)}>
            <td className="p-1" style={{ textAlign: 'left' }}>{wei2ether(order[0])}</td>
            <td className="p-1">{wei2ether(order[1])}</td>
            <td className="p-1">{wei2ether(order[2])}</td>
          </tr>
        )
      })}
    </tbody>
)

const NoOrdersTable = () => (
    <tbody>
      <tr className="text-center text-capitalize">
        <td colSpan={3}>no orders found</td>
      </tr>
    </tbody>
)

const Orders = ({
  selectedCurrencyPair,
  baseCurrency,
  quoteCurrency,
}:OrdersProps) => {

  const pair = tokenPairs[selectedCurrencyPair ? selectedCurrencyPair : 'NO/PAIR']

  const { loading, error, data } = useQuery(getPairMakes(pair), { pollInterval: 1000 })

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error! {error.message}</span>

  const redOrders:OrdersData = {}
  const greenOrders:OrdersData = {}
  let totalRed:BigNumber = new BigNumber(0)
  let totalGreen:BigNumber = new BigNumber(0)
  let orders:OrdersData

  data.makes.forEach((order:any) => {
    const buyAmt = new BigNumber(order.buyAmt)
    const payAmt = new BigNumber(order.payAmt)

    const price = buyAmt.div(payAmt)
    const priceIndex:string = price.toString()

    if (order.payGem === baseCurrency) {
      orders = redOrders
      totalRed = totalRed.plus(price)
    } else {
      orders = greenOrders
      totalGreen = totalGreen.plus(price)
    }

    if (priceIndex in orders) {
      orders[priceIndex][1] = orders[priceIndex][1].plus(payAmt)
      orders[priceIndex][2] = orders[priceIndex][2].plus(buyAmt)
    } else {
      orders[priceIndex] = [price, payAmt, buyAmt]
    }
  })

  return <>
    <div className="orderbook orderbook-sell-orders">
      <table className="table table-borderless table-dark table-striped table-hover table-sm">
        <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
          {Object.keys(redOrders).length ? (
            <OrdersTable orders={redOrders} color="red" total={totalRed} />
          ) : (
            <NoOrdersTable />
          )}
      </table>
    </div>

    {(totalGreen.gt(totalRed)) && (
      <div className="orders-price-change-indicator green">
        {wei2ether(totalGreen.minus(totalRed))} <ArrowUp fill="#169A51" />
      </div>
    )}

    {(totalGreen.lt(totalRed)) && (
      <div className="orders-price-change-indicator red">
        {wei2ether(totalRed.minus(totalGreen))} <ArrowDown fill="#C22D38" />
      </div>
    )}

    {(totalGreen.eq(totalRed)) && (
      <div className="orders-price-change-indicator">
        {wei2ether(totalGreen)}
      </div>
    )}

    <div className="orderbook orderbook-buy-orders">
      <table className="table table-borderless table-dark table-striped table-hover table-sm">
        {Object.keys(greenOrders).length ? (
          <OrdersTable orders={greenOrders} color="green" total={totalGreen} />
        ) : (
          <NoOrdersTable />
        )}
        <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
      </table>
    </div>
  </>
}

export default Orders