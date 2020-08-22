const TAB_MARKETS = 'TAB_MARKETS'
const TAB_MARKETS_ETH = 't1'
const TAB_MARKETS_USDT = 't2'
const TAB_SELECTEDMARKET_ORDERS = 't3'
const TAB_SELECTEDMARKET_DEPTH = 't4'
const TAB_SELECTEDMARKET_HISTORY = 't5'
const TAB_USERDATA = 'TAB_USERDATA'
const TAB_USERDATA_OPEN_ORDERS = 't6'
const TAB_USERDATA_ORDER_HISTORY = 't7'
const TAB_USERDATA_FUNDS = 't8'
const TAB_USERDATA_TRADE_HISTORY = 't9'

const TAB_MENU_MARKETS = [
  { key: TAB_MARKETS_ETH, title: "ETH" },
  { key: TAB_MARKETS_USDT, title: "USDT" },
]

const TAB_MENU_SELECTEDMARKET = [
  { key: TAB_SELECTEDMARKET_ORDERS, title: "Orders" },
  { key: TAB_SELECTEDMARKET_DEPTH, title: "Depth" },
  { key: TAB_SELECTEDMARKET_HISTORY, title: "History" },
]

const TAB_MENU_USERDATA = [
  { key: TAB_USERDATA_OPEN_ORDERS, title: "Open Orders" },
  { key: TAB_USERDATA_ORDER_HISTORY, title: "Order History" },
  { key: TAB_USERDATA_FUNDS, title: "Funds" },
  { key: TAB_USERDATA_TRADE_HISTORY, title: "Trade History" },
]

const TAB_MENU_MARKETS_NAME = 'TAB_MENU_MARKETS_NAME'
const TAB_MENU_SELECTEDMARKET_NAME = 'TAB_MENU_SELECTEDMARKET_NAME'
const TAB_MENU_USERDATA_NAME = 'TAB_MENU_USERDATA_NAME'

export {
  TAB_MARKETS,
  TAB_MARKETS_ETH,
  TAB_MARKETS_USDT,
  TAB_SELECTEDMARKET_ORDERS,
  TAB_SELECTEDMARKET_DEPTH,
  TAB_SELECTEDMARKET_HISTORY,
  TAB_USERDATA,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_USERDATA_ORDER_HISTORY,
  TAB_USERDATA_FUNDS,
  TAB_USERDATA_TRADE_HISTORY,
  TAB_MENU_MARKETS,
  TAB_MENU_SELECTEDMARKET,
  TAB_MENU_USERDATA,
  TAB_MENU_MARKETS_NAME,
  TAB_MENU_SELECTEDMARKET_NAME,
  TAB_MENU_USERDATA_NAME,
}