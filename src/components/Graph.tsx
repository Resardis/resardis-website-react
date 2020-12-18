import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { connect, ConnectedProps } from 'react-redux'
import moment from 'moment'
import { RootState } from '../reducers'
import { ReactComponent as Menu } from '../svg/menu.svg'
import { getDataSeries } from '../gqlQueries/Graph'
import { Network, getSelectedCurrencyTokenPair } from '../constants/networks'
import '../css/Graph.css'

import { tsvParse } from 'd3-dsv'
import { timeParse } from 'd3-time-format'
import Chart from '../Chart'

interface StateProps {
  selectedCurrencyPair: string,
  accountAddress: string,
  network: Network,
}

const mapStateToProps = (state: RootState):StateProps => ({
  selectedCurrencyPair: state.markets.selectedCurrencyPair,
  accountAddress: state.funds.accountAddress,
  network: state.contract.network,
})

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type ChartConfig = {
  timeDataType: string,
}

interface OwnProps {
  chartConfig: ChartConfig,
}

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

interface MenuLeftProps {
  chartConfig: ChartConfig,
  setChartConfig: Function,
}

const MenuLeft = ({ chartConfig, setChartConfig }:MenuLeftProps) => (
  <div className="graph-menu-left">
    <button style={{ backgroundColor: '#0C1013' }}>
      <Menu fill="#C2C3C3" width="24px" height="24px" />
    </button>
    <button onClick={() => setChartConfig({
        ...chartConfig,
        timeDataType: chartConfig.timeDataType === 'day' ? '1D' : '1H'
    })}>
      {chartConfig.timeDataType === 'day' ? '1D' : '1H' }
    </button>
    <button>
      V
    </button>
  </div>
)

const LegendTopConnected = ({ selectedCurrencyPair }:PropsFromRedux) => (
  <div className="graph-legend-top">
      <h4>{selectedCurrencyPair}</h4>
      <h4>Ave</h4>
      <h4>0.00000000</h4>

      <div>
        24h Change<br/>
        %13
      </div>
      <div>
        24h High<br/>
        0.00000000
      </div>
      <div>
        24h Low<br/>
        0.00000000
      </div>
      <div>
        24h Volume<br/>
        0.00000000
      </div>
  </div>
)

const LegendTop = connector(LegendTopConnected)

function parseData(parse:any) {
  return function(d:any) {
    d.date = parse(d.date);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.volume;
  return d;
}}

const parseDate = timeParse("%Y-%m-%d");

const buildSeries = (data:any) => {
  const periods:any = {
  }

  data.forEach((trade:any) => {
    const day = moment.unix(trade.startUnix).format('YYYY-MM-DD')
    if (day in periods) {
      const prev = periods[day]
      periods[day] = {
        date: parseData(day),
        open: prev.open + (trade.openBuyOverPay - prev.open)/(prev.count),
        high: prev.high + (trade.maxBuyOverPay - prev.high)/(prev.count),
        low: prev.low + (trade.minBuyOverPay - prev.low)/(prev.count),
        close: prev.close + (trade.closeBuyOverPay - prev.close)/(prev.count),
        volume: prev.volume + (trade.buyAmt - prev.volume)/(prev.count),
        count: prev.count + 1,
      }
    } else {
      periods[day] = {
        date: day,
        open: trade.openBuyOverPay,
        high: trade.maxBuyOverPay,
        low: trade.minBuyOverPay,
        close: trade.closeBuyOverPay,
        volume: trade.buyAmt,
        //volume:10,
        count: 1,
      }
    }
  })
  const sortedData = Object.keys(periods)
  .sort((a,b) => a > b ? 1 : -1)
  .map(date => periods[date])

  let tsv = `date\topen\thigh\tlow\tclose\tvolume\n`
  sortedData.forEach(d => tsv += `${d.date}\t${d.open}\t${d.high}\t${d.low}\t${d.close}\t${d.volume}\n`)

  return tsvParse(tsv, parseData(parseDate))
}

const ChartComponentConnected = ({ selectedCurrencyPair, chartConfig, network }:Props) => {
  const [baseToken, ] = getSelectedCurrencyTokenPair(selectedCurrencyPair, network)

  const { loading, error, data } = useQuery(getDataSeries(chartConfig.timeDataType, baseToken), { pollInterval: 1000 })

  if (error) return <div className="chart-message">Error! {error.message}</div>
  if (loading) return <div className="chart-message">Loading...</div>
  if (data.pairTimeDatas.length === 0) return <div className="chart-message">No data</div>

  // duplicate record, so chart doesn't crash
  const f = [
    { ...data.pairTimeDatas[0] },
    { ...data.pairTimeDatas[0] }
  ]
  f[1].startUnix =1605684800

  const series = buildSeries(f)

  return (
    <Chart data={series} />
  )
}
const ChartComponent = connector(ChartComponentConnected)

const Graph = () => {
  const [ chartConfig, setChartConfig ] = useState({
    timeDataType: 'day',
  })

  return (
    <div className="graph main-tab">
      <LegendTop />
      <div style={{ display: 'flex', flex: 1 }}>
        <MenuLeft chartConfig={chartConfig} setChartConfig={setChartConfig} />
        <div className="graph-container">
          <ChartComponent chartConfig={chartConfig} />
        </div>
      </div>
    </div>
  )
}

export default Graph
