import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './reducers'
import './App.scss'
import {
  FundsWindow,
  Funds,
  Graph,
  Header,
  Markets,
  OrderForm,
  SelectedMarket,
  UserData,
} from './components'
import { openFundsWindow } from './actions'
import { OpenFundsWindowAction } from './constants/actionTypes'

interface StateProps {
  selectedScreen: string,
  isWalletEnabled: boolean,
}

const mapStateToProps = (state: RootState): StateProps => ({
  selectedScreen: state.selectedScreen,
  isWalletEnabled: state.funds.isWalletEnabled,
})

const mapDispatchToProps = (dispatch:any) => ({
  openFundsWindow: ():OpenFundsWindowAction => dispatch(openFundsWindow()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const App = ({ selectedScreen, isWalletEnabled, openFundsWindow }: PropsFromRedux) => {

  //if (!isWalletEnabled) openFundsWindow()

  return (
    <div>
      <FundsWindow />
      <Header />

      <div className="container-fluid main-container py-3">
        <div className="row h-100">
          {selectedScreen === 'Funds' ? (
            <div className="col-12">
              <Funds />
            </div>
            ) : (
            <>
            <div className="col-xl-3 selected-market-parent">
              <SelectedMarket />
            </div>
            <div className="col-xl-6 middle-column">
              <div className="row pb-3">
                <div className="col-12 graph-wrapper">
                  <Graph />
                </div>
              </div>
              <div className="row pb-3">
                <div className="col-12 order-form-wrapper">
                  <OrderForm />
                </div>
              </div>
              <div className="row pb-3">
                <div className="col-12 user-data-wrapper">
                  <UserData />
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <Markets/>
            </div>
            </>
          )}
       </div>
      </div>

    </div>
  )
}

export default connector(App)
