import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { ReactComponent as Menu } from '../svg/menu.svg'
import '../css/Graph.css'

interface StateProps {
  selectedCurrencyPair: string,
}

const mapStateToProps = (state: RootState):StateProps => ({
  selectedCurrencyPair: state.markets.selectedCurrencyPair,
})

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const MenuLeft = () => (
  <div className="graph-menu-left">
    <button style={{ backgroundColor: '#0C1013' }}>
      <Menu fill="#C2C3C3" width="24px" height="24px" />
    </button>
    <button>
      1D
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

const GraphContainer = () => (
  <div className="graph-container">
    here be the graph
  </div>
)

const Graph = ({ selectedCurrencyPair }:PropsFromRedux) => (
  <div className="graph main-tab">

    <LegendTop />

    <div style={{ display: 'flex', flex: 1 }}>
      <MenuLeft />
      <GraphContainer />
    </div>

  </div>
)

export default connector(Graph)
