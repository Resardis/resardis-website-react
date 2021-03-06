import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import '../css/OrderForm.css'
import { BigNumber } from 'bignumber.js'
import { wei2ether } from '../helpers'
import { createOrder } from '../contracts'
import { Network } from '../constants/networks'
import { MyOrderType } from '../constants/actionTypes'

interface OrderForm {
  coinName: string,
  isBuy: boolean,
}

const FIXED = 14

const getSelectedCurrencyPrice = (state: RootState) => {
  const { selectedCurrencyPair, data } = state.markets

  if (!selectedCurrencyPair) return new BigNumber(0)

  if (!(selectedCurrencyPair in data)) return new BigNumber(0)

  return data[selectedCurrencyPair][3]
}

interface StateProps {
  baseCurrency: string,
  quoteCurrency: string,
  price: BigNumber,
  amount: BigNumber,
  baseCurrencyBalance: BigNumber,
  quoteCurrencyBalance: BigNumber,
  network: Network,
  api: any,
}

interface OwnProps {
  orderType: string,
  isBuy: boolean,
}

const mapStateToProps = (state: RootState, ownProps:OwnProps):StateProps => {
  const commonProps = {
    network: state.contract.network,
    api: state.contract.contractAPI,
  }

  if (state.markets.selectedOrder && (
      ownProps.isBuy === (state.markets.selectedOrder.side === 'Buy')
  )) {
    const [ baseCurrency, quoteCurrency ] = state.markets.selectedOrder.pair.split('/')

    return {
    price: new BigNumber(state.markets.selectedOrder.price),
    amount: new BigNumber(state.markets.selectedOrder.amount).div(1e+18),
    baseCurrency,
    quoteCurrency,
    baseCurrencyBalance: state.funds.balances[baseCurrency].resardis,
    quoteCurrencyBalance: state.funds.balances[quoteCurrency].resardis,
    ...commonProps
  }}

  if (!state.markets.selectedCurrencyPair) return {
    price: new BigNumber(0),
    amount: new BigNumber(0),
    baseCurrency: '',
    quoteCurrency: '',
    baseCurrencyBalance: new BigNumber(0),
    quoteCurrencyBalance: new BigNumber(0),
    ...commonProps
  }
  const [ baseCurrency, quoteCurrency ] = state.markets.selectedCurrencyPair.split('/')

  return {
    price: getSelectedCurrencyPrice(state),
    amount: new BigNumber(0),
    baseCurrency,
    quoteCurrency,
    baseCurrencyBalance: state.funds.balances[baseCurrency].resardis,
    quoteCurrencyBalance: state.funds.balances[quoteCurrency].resardis,
    ...commonProps
  }
}

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const OrderFormConnected = ({
  baseCurrency,
  quoteCurrency,
  baseCurrencyBalance,
  quoteCurrencyBalance,
  price,
  amount,
  orderType,
  isBuy,
  network,
  api,
}:Props) => {
  useEffect(() => {
    const baseToken = Object.keys(network.tokens).find(address => network.tokens[address] === baseCurrency)
    const quoteToken = Object.keys(network.tokens).find(address => network.tokens[address] === quoteCurrency)

    setOrderData(orderData => ({
      ...orderData,
      price: price.toFixed(FIXED),
      amount: amount.toFixed(FIXED),
      total: amount.multipliedBy(price).toFixed(FIXED),
      baseToken: baseToken || '',
      quoteToken: quoteToken || '',
      offerType: (orderType === 'Limit') ? 0 : 1,
    }))
  }, [price, amount, baseCurrency, orderType, quoteCurrency, network.tokens])

  const [ orderData, setOrderData ] = useState({
    price: price.toFixed(FIXED),
    amount: amount.toFixed(FIXED),
    total: amount.multipliedBy(price).toFixed(FIXED),
    offerType: (orderType === 'Limit') ? 0 : 1,
    isBuy,
    baseToken: '',
    quoteToken: '',
    selectionStart: 0,
})
  const updateOrderData = (e:any) => {
    // disallow non-BigNumber values
    if (e.target.value !== '' && new BigNumber(e.target.value).toString() === 'NaN') return
    let newOrderData = { ...orderData, [e.target.name]: e.target.value}
    const { amount, price } = newOrderData
    newOrderData.total = new BigNumber(amount).multipliedBy(new BigNumber(price)).toFixed(FIXED)
    setOrderData(newOrderData)
  }

  const isLimit = orderType === 'Limit'
  const total = new BigNumber(orderData.total).multipliedBy(1e+18)
  const buyError = isBuy && quoteCurrencyBalance.lt(total)
  const sellError = !isBuy && baseCurrencyBalance.lt(new BigNumber(orderData.amount))
  const DOMID = isBuy ? 'buyButtonOrderID' : 'sellButtonOrderID'

  return (
  <div className="order-form-box">
    <div className="order-form-row">
      <div>Price</div>
      <div className={"order-price" + (isLimit ? '' : ' order-price-disabled')}>
        <div>
          1 {baseCurrency} =
        </div>
        {orderType === 'Limit' ? (
          <input name="price" type="text" value={orderData.price} onChange={e => updateOrderData(e)} />
        ) : (
          <input name="price" type="text" value={orderData.price} disabled />
        )}
      </div>
    </div>
    <div className="order-form-row">
      <div>Amount</div>
      {buyError && (
        <div className="order-form-error">
          Not enough ETH for this buy order
        </div>
      )}
      {sellError && (
        <div className="order-form-error">
          Not enough {baseCurrency} for this sell order
        </div>
      )}
      <input
        style={ (buyError || sellError) ? { borderColor: 'red' } : {}}
        name="amount"
        type="text"
        value={orderData.amount}
        onChange={e => updateOrderData(e)}
       />
    </div>

    <div className="order-form-row">
      <div>Total</div>
      <input name="total" type="text" disabled value={`${orderData.total} ${quoteCurrency}`} />
    </div>
    <div className="order-form-row">
    <div className="order-balance">
      Balance {isBuy ?
        `${quoteCurrency} ${wei2ether(quoteCurrencyBalance, 10)}`
        :
        `${baseCurrency} ${wei2ether(baseCurrencyBalance, 10)}`
      }
    </div>
    <button className={'order-button ' + (isBuy ? 'greenBG' : 'redBG')}
      id={isBuy ? 'buyButtonOrderID' : 'sellButtonOrderID'}
      onClick={() => {
        //console.log(`_==_=++', quoteCurrency: ${quoteCurrency}, baseCurrency: ${baseCurrency}, baseToken: ${orderData.baseToken}, quoteToken: ${orderData.quoteToken}`)
        createOrder(api, orderData, DOMID)
      }}
    >
      {isBuy ? 'Buy' : 'Sell'} {baseCurrency}
    </button>
    </div>
  </div>
)}
const OrderForm = connector(OrderFormConnected)

interface NewOrderProps {
  selectedOrder: MyOrderType | null,
}

const NewOrder = ({ selectedOrder }:NewOrderProps) => {
  const [ orderType, setOrderType ] = useState(selectedOrder ? selectedOrder.type : 'Limit')

  useEffect(() => setOrderType(selectedOrder ? selectedOrder.type : 'Limit'), [selectedOrder])

  return (
  <div className="order-form main-tab">
    <div className="order-form-header">
      <button className={"order-type-button" + (orderType === 'Limit' ? ' order-type-button-selected' : '')}
        onClick={() => setOrderType('Limit')}
      >
        Limit
      </button>
      <button className={"order-type-button" + (orderType === 'Market' ? ' order-type-button-selected' : '')}
        onClick={() => setOrderType('Market')}
      >
        Market
      </button>
    </div>

    <div className="order-form-boxes">
      <OrderForm isBuy={true} orderType={orderType} />
      <OrderForm isBuy={false} orderType={orderType} />
    </div>
  </div>
)}

export default connect(
  (state:RootState):NewOrderProps => ({ selectedOrder: state.markets.selectedOrder })
)(NewOrder)
