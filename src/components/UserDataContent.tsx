import React from 'react'
import {
  TAB_USERDATA,
  TAB_MENU_USERDATA_NAME,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_USERDATA_ORDER_HISTORY,
  TAB_USERDATA_FUNDS,
  TAB_USERDATA_TRADE_HISTORY,
} from '../constants/tabData'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { UserDataType } from '../reducers/userData'
import { updateTextFilter } from '../actions'
import { SearchBox } from './shared'
import { number4DP } from '../helpers'
import { ReactComponent as CalendarIcon } from '../svg/calendar_today.svg'

type headerType = Array<string | React.ReactNode>
type dataType = Array<UserDataType>

type headersAndContents = {
  [key:string]: {
    header: headerType,
    content: Function,
  }
}

interface StateProps {
  activeTab: string,
  textFilter: string,
  header: headerType,
  data: dataType,
  content: Function,
}

interface Table {
  header: headerType,
  children: React.ReactNode,
}

interface Content { data: dataType }

const mapStateToProps = (state: RootState):StateProps => {
  const activeTab = state.activeTabs[TAB_MENU_USERDATA_NAME]
  return {
    activeTab,
    textFilter: state.userData.textFilter,
    header: headersAndContents[activeTab].header,
    data: state.userData.data[activeTab],
    content: headersAndContents[activeTab].content,
  }
}

const mapDispatchToProps = (dispatch:any) => ({
  updateTextFilter: (target:string, textFilter:string) => dispatch(updateTextFilter(target, textFilter)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const OpenOrders = ({ data }:Content) => (
  <>
  {data.map((row,i) => (
    <tr key={i}>
      <td style={{ textAlign: 'left' }}>{row[0]}</td>
      <td>{row[1]}</td>
      <td>{row[2]}</td>
      <td style={{ color: row[3] === 'Buy' ? '#D5002A' : '#00AA55'}}>{row[3]}</td>
      <td>{number4DP(Number(row[4]))}</td>
      <td>{number4DP(Number(row[5]))}</td>
      <td>{row[5]}%</td>
      <td>{number4DP(Number(row[5]))}</td>
      <td>
        <button className="cancel-button">Cancel</button>
      </td>
    </tr>
  ))}
  </>
)

const OrderHistory = ({ data }:Content) => (
  <>
  {data.map((row,i) => (
    <tr key={i}>
      <td style={{ textAlign: 'left' }}>{row[0]}</td>
      <td>{row[1]}</td>
      <td>{row[2]}</td>
      <td style={{ color: row[3] === 'Buy' ? '#D5002A' : '#00AA55'}}>{row[1]}</td>
      <td>{number4DP(Number(row[4]))}</td>
      <td>{number4DP(Number(row[5]))}</td>
      <td>{number4DP(Number(row[6]))}</td>
      <td>{number4DP(Number(row[7]))}</td>
      <td>{row[8]}</td>
    </tr>
  ))}
  </>
)

const Funds = ({ data }:Content) => (
  <>
  {data.map((row,i) => (
    <tr key={i}>
      <td style={{ textAlign: 'left' }}>{row[0]}</td>
      <td>{number4DP(Number(row[1]))}</td>
      <td>{number4DP(Number(row[2]))}</td>
      <td>{number4DP(Number(row[3]))}</td>
    </tr>
  ))}
  </>
)

const TradeHistory = ({ data }:Content) => (
  <>
  {data.map((row,i) => (
    <tr key={i}>
      <td style={{ textAlign: 'left' }}>{row[0]}</td>
      <td>{row[1]}</td>
      <td>{row[2]}</td>
      <td style={{ color: row[3] === 'Buy' ? '#D5002A' : '#00AA55'}}>{row[1]}%</td>
      <td>{number4DP(Number(row[4]))}</td>
      <td>{number4DP(Number(row[5]))}</td>
      <td>{number4DP(Number(row[6]))}</td>
      <td>{number4DP(Number(row[7]))}</td>
    </tr>
  ))}
  </>
)

const DateHeader = () => (
  <div className="date-header">
    <CalendarIcon width="15px" height="15px" fill="#8E9091" style={{ marginRight: '4px' }} />
    Date
  </div>
)

const Cancel = () => <button className="cancel-all-button">Cancel all</button>

const Search = connector(({ textFilter, updateTextFilter }: PropsFromRedux) => (
  <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target={TAB_USERDATA} />
))

const headersAndContents:headersAndContents = {
  [TAB_USERDATA_OPEN_ORDERS]: {
    header: [ <DateHeader />, 'Pair', 'Type', 'Side', 'Price', 'Amount', 'Filled', 'Total', <Cancel /> ],
    content: (data:dataType) => <OpenOrders data={data} />,
  },
  [TAB_USERDATA_FUNDS]: {
    header: [ <Search />, 'Available', 'In Order', 'Total' ],
    content: (data:dataType) => <Funds data={data} />,
  },
  [TAB_USERDATA_ORDER_HISTORY]: {
    header: [ 'Date', 'Pair', 'Type', 'Side', 'Average', 'Price', 'Executed', 'Amount', 'Status' ],
    content: (data:dataType) => <OrderHistory data={data} />,
  },
  [TAB_USERDATA_TRADE_HISTORY]: {
    header: [ 'Date', <Search />, 'Type', 'Side', 'Average', 'Price', 'Amount', 'Fee' ],
    content: (data:dataType) => <TradeHistory data={data} />,
  },
}

const Table = ({ header, children }:Table) => (
  <>
    <table className="user-data-table">
      <thead>
        <tr>
          {header.map((item, i) => <th key={i}>{item}</th>)}
        </tr>
      </thead>
      </table>
      <div className="container-scroll">
      <table className="user-data-table">
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  </>
)

interface Tab {
  header: headerType,
  content: Function,
  data: dataType,
}

const Tab = ({ header, content, data }:Tab) => (
  <Table header={header}>
    {content(data)}
  </Table>
)

export default connector(({ header, data, content }:PropsFromRedux) => (
  <Tab header={header} content={content} data={data} />
))