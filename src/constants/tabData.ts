const TAB_MARKETS = 'TAB_MARKETS'
const TAB_MARKETS_ETH = 't1'
const TAB_MARKETS_DAI = 't2'
const TAB_SELECTEDMARKET_ORDERS = 't3'
const TAB_SELECTEDMARKET_DEPTH = 't4'
const TAB_SELECTEDMARKET_HISTORY = 't5'
const TAB_USERDATA = 'TAB_USERDATA'
const TAB_USERDATA_OPEN_ORDERS = 't6'
const TAB_USERDATA_ORDER_HISTORY = 't7'
const TAB_USERDATA_FUNDS = 't8'
const TAB_USERDATA_TRADE_HISTORY = 't9'
const TAB_FUNDS_ASSETS = 't10'
const TAB_FUNDS_TRANSFER = 't11'
const TAB_FUNDS_MARKET_HISTORY = 't12'
const TAB_USERDATA_WITHDRAW = 't13'
const TAB_USERDATA_DEPOSIT = 't14'

const TAB_MENU_MARKETS = [
  { key: TAB_MARKETS_ETH, title: "ETH" },
  { key: TAB_MARKETS_DAI, title: "DAI" },
]

const TAB_MENU_SELECTEDMARKET = [
  { key: TAB_SELECTEDMARKET_ORDERS, title: "Orders" },
  { key: TAB_SELECTEDMARKET_DEPTH, title: "Depth" },
  { key: TAB_SELECTEDMARKET_HISTORY, title: "History" },
]

const TAB_MENU_USERDATA = [
  { key: TAB_USERDATA_FUNDS, title: "Funds" },
  { key: TAB_USERDATA_DEPOSIT, title: "Deposit" },
  { key: TAB_USERDATA_WITHDRAW, title: "Withdraw" },
  // { key: TAB_USERDATA_TRADE_HISTORY, title: "Trade History" },
  // { key: TAB_USERDATA_OPEN_ORDERS, title: "Open Orders" },
  // { key: TAB_USERDATA_ORDER_HISTORY, title: "Order History" },
]

const TAB_MENU_FUNDS = [
  { key: TAB_FUNDS_ASSETS, title: 'Assets' },
  { key: TAB_FUNDS_TRANSFER, title: 'Transfer' },
  { key: TAB_FUNDS_MARKET_HISTORY, title: 'Market History' },
]

const TAB_MENU_MARKETS_NAME = 'TAB_MENU_MARKETS_NAME'
const TAB_MENU_SELECTEDMARKET_NAME = 'TAB_MENU_SELECTEDMARKET_NAME'
const TAB_MENU_USERDATA_NAME = 'TAB_MENU_USERDATA_NAME'
const TAB_MENU_FUNDS_NAME = 'TAB_MENU_FUNDS_NAME'

export {
  TAB_MARKETS,
  TAB_MARKETS_ETH,
  TAB_MARKETS_DAI,
  TAB_SELECTEDMARKET_ORDERS,
  TAB_SELECTEDMARKET_DEPTH,
  TAB_SELECTEDMARKET_HISTORY,
  TAB_USERDATA,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_USERDATA_ORDER_HISTORY,
  TAB_USERDATA_FUNDS,
  TAB_USERDATA_TRADE_HISTORY,
  TAB_USERDATA_WITHDRAW,
  TAB_USERDATA_DEPOSIT,
  TAB_MENU_MARKETS,
  TAB_MENU_SELECTEDMARKET,
  TAB_MENU_USERDATA,
  TAB_MENU_MARKETS_NAME,
  TAB_MENU_SELECTEDMARKET_NAME,
  TAB_MENU_USERDATA_NAME,
  TAB_MENU_FUNDS,
  TAB_MENU_FUNDS_NAME,
  TAB_FUNDS_ASSETS,
  TAB_FUNDS_TRANSFER,
  TAB_FUNDS_MARKET_HISTORY,
}