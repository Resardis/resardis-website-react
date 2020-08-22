import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import {
  TAB_MENU_MARKETS_NAME,
  TAB_MARKETS_USDT,
} from '../constants/tabData'
import '../css/OrderForm.css'

interface OrderForm {
  coinName: string,
  isBuy: boolean,
}
// TODO: update when real data is pulled
const getSelectedCurrencyPrice = (state: RootState) => {
  let currentMarket
  if (!state.markets.selectedCurrencyPair) return 0

  if (state.activeTabs[TAB_MENU_MARKETS_NAME] === TAB_MARKETS_USDT)
    currentMarket = state.markets.dataUSDT
  else
    currentMarket = state.markets.dataETH

  const currencyData = currentMarket.find(currency => currency[0] === state.markets.selectedCurrencyPair)

  if (currencyData) return currencyData[3]

  return 0
}

interface StateProps {
  baseCurrency: string,
  quoteCurrency: string,
  price: number,

}

interface OwnProps {
  isBuy: boolean,
}

const mapStateToProps = (state: RootState):StateProps => {
  if (!state.markets.selectedCurrencyPair) return {
    price: 0,
    baseCurrency: '',
    quoteCurrency: '',
  }
  const [ baseCurrency, quoteCurrency ] = state.markets.selectedCurrencyPair.split('/')
  return {
    price: getSelectedCurrencyPrice(state),
    baseCurrency,
    quoteCurrency,
  }
}

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const OrderFormConnected = ({ baseCurrency, quoteCurrency, price, isBuy }:Props) => (
  <div className="order-form-box">
    <div className="order-form-row">
      <div>Price</div>
      <div className="order-price">
        <div>
          1 {baseCurrency} =
        </div>
        <input type="text" value={price} />
      </div>
    </div>
    <div className="order-form-row">
      <div>Amount</div>
      <input type="text" />
    </div>
    <div className="order-form-row">
      <div>Total</div>
      <input type="text" />
    </div>
    <div className="order-form-row">
      <div className="order-balance">Balance {isBuy ? quoteCurrency : baseCurrency }: 0.00000000</div>
      <button className={'order-button ' + (isBuy ? 'greenBG' : 'redBG')}>
        {isBuy ? 'Buy' : 'Sell'} {baseCurrency}
      </button>
    </div>
  </div>
)
const OrderForm = connector(OrderFormConnected)

const NewOrder = () => {
  const [ orderType, setOrderType ] = useState('limit')

  return (
  <div className="order-form main-tab">
    <div className="order-form-header">
      <button className={"order-type-button" + (orderType === 'limit' ? ' order-type-button-selected' : '')}
        onClick={() => setOrderType('limit')}
      >
        Limit
      </button>
      <button className={"order-type-button" + (orderType === 'market' ? ' order-type-button-selected' : '')}
        onClick={() => setOrderType('market')}
      >
        Market
      </button>
    </div>

    <div className="order-form-boxes">
      <OrderForm isBuy={true} />
      <OrderForm isBuy={false} />
    </div>
  </div>
)}

export default NewOrder
