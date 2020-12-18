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
}

const mapStateToProps = (state: RootState): StateProps => ({
  selectedScreen: state.selectedScreen,
})

const mapDispatchToProps = (dispatch:any) => ({
  openFundsWindow: ():OpenFundsWindowAction => dispatch(openFundsWindow()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const App = ({ selectedScreen }: PropsFromRedux) => {
  return (
    <div className="h-100">
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
            <div className="col-xl-3 left-column">
              <SelectedMarket />
            </div>
            <div className="col-xl-6 middle-column">
                <div className="graph-wrapper">
                  <Graph />
                </div>
                <div className="order-form-wrapper">
                  <OrderForm />
                </div>
                <div className="user-data-wrapper">
                  <UserData />
                </div>
            </div>
            <div className="col-xl-3 right-column">
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
