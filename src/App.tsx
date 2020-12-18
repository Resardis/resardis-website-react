import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './reducers'
import './App.css'
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
    <div className="main-grid">
      <FundsWindow />
      <Header />

      {selectedScreen === 'Funds' ? (
        <Funds />
        ) : (
        <>
          <SelectedMarket />
          <Graph />
          <OrderForm />
          <UserData />
          <Markets/>
        </>
      )}

    </div>
  )
}

export default connector(App)
