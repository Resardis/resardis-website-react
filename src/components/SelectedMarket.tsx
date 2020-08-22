import React from 'react'
import { TabbedNav } from './shared'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import {
  TAB_MENU_SELECTEDMARKET,
  TAB_MENU_SELECTEDMARKET_NAME,
  TAB_SELECTEDMARKET_ORDERS,
  TAB_SELECTEDMARKET_DEPTH,
  TAB_SELECTEDMARKET_HISTORY,
} from '../constants/tabData'
import { Markets, OrdersData } from '../reducers/markets'
import { number4DP } from '../helpers'
import { ReactComponent as ArrowUp } from '../svg/arrow-up.svg'
import { ReactComponent as ArrowDown } from '../svg/arrow-down.svg'
import '../css/SelectedMarket.css'

type History = Array<Array<[number, number, number]>>
type Orders = Array<Array<[number, number, number]>>

interface StateProps {
  activeTab: string,
  orders: OrdersData,
  baseCurrency: string,
  quoteCurrency: string,
}

interface OrdersProps {
  orders: OrdersData,
  baseCurrency: string,
  quoteCurrency: string,
}
interface OrdersHeaderProps {
  baseCurrency: string,
  quoteCurrency: string,
}

const getSelectedMarketData = (markets:Markets):OrdersData => {
  return markets.ordersData
}

const mapStateToProps = (state: RootState):StateProps => {
  const activeTab = state.activeTabs[TAB_MENU_SELECTEDMARKET_NAME]

  if (!state.markets.selectedCurrencyPair) return {
    activeTab, orders: [], baseCurrency: '', quoteCurrency: ''
  }

  const [ baseCurrency, quoteCurrency ] = state.markets.selectedCurrencyPair.split('/')

  return {
    activeTab,
    orders: getSelectedMarketData(state.markets),
    baseCurrency,
    quoteCurrency,
  }
}

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const OrdersHeader = ({ baseCurrency, quoteCurrency }:OrdersHeaderProps) => (
  <table className="market-orders-header">
    <thead>
      <tr>
        <th>Price</th>
        <th>Amount({baseCurrency})</th>
        <th>Total({quoteCurrency})</th>
      </tr>
    </thead>
  </table>
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

const orderRowBackgroudColor = (rowIndex:number, theme:string) => {
  const colors = colorThemes[theme][rowIndex%2]

  return {
    background: `linear-gradient(90deg, ${colors[0]} 21%, ${colors[1]} 21%, ${colors[1]} 48%, ${colors[2]} 48%`
  }
}


interface OrdersTableProps {
  orders: OrdersData,
  color: string,
}
const OrdersTable = ({orders, color}:OrdersTableProps) => (
  <table className="market-orders-content">
    <tbody>
      {orders.map((order, i) => (
        <tr key={i} style={orderRowBackgroudColor(i, color)}>
          <td>{number4DP(order[0])}</td>
          <td>{number4DP(order[1])}</td>
          <td>{number4DP(order[2])}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

const Orders = ({ baseCurrency, quoteCurrency, orders }:OrdersProps) => (
  <>
    <div className="container" style={{ padding: '0 12px 12px 12px' }}>
      <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
      <div className="container-scroll" style={{ margin: 0 }}>
        <OrdersTable orders={orders} color="red" />
      </div>
    </div>

    <div className="orders-price-change-indicator green">
      0.0000 <ArrowUp fill="#169A51" />
    </div>
    <div className="orders-price-change-indicator red">
      0.0000 <ArrowDown fill="#C22D38" />
    </div>

    <div className="container" style={{ borderRadius: '12px', padding: '12px 12px 0 12px' }}>
      <div className="container-scroll">
        <OrdersTable orders={orders} color="green" />
      </div>
      <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
    </div>
  </>
)

interface DepthProps {
  orders: OrdersData,
}
const Depth = ({ orders }:DepthProps) => (
  <div className="container">
    <div className="container-inner-box">
    </div>
  </div>
)

const History = ({ orders }:{orders: OrdersData}) => (
  <>
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
            {orders.map(order => (
              <tr>
                <td>{number4DP(order[0])}</td>
                <td>{number4DP(order[1])}</td>
                <td>{number4DP(order[2])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ minHeight: '12px' }}></div>
    </div>
  </div>
  </>
)

const ContentConnected = ({ activeTab, orders, baseCurrency, quoteCurrency }:PropsFromRedux) => {
  switch (activeTab) {
    case TAB_SELECTEDMARKET_ORDERS:
      return <Orders orders={orders} baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
    case TAB_SELECTEDMARKET_DEPTH:
      return <Depth orders={orders} />
    case TAB_SELECTEDMARKET_HISTORY:
      return <History orders={orders} />
    default:
      return null
  }
}

const Content = connector(ContentConnected)

const SelectedMarket = () => (
  <div className="selected-market main-tab">
    <TabbedNav items={TAB_MENU_SELECTEDMARKET} tabbedNavigationName={TAB_MENU_SELECTEDMARKET_NAME} />
    <Content />
  </div>
)

export default connect()(SelectedMarket)
