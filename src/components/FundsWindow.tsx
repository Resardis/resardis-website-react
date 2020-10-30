import React from 'react'
import ReactDOM from 'react-dom'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import { closeFundsWindow } from '../actions'
import { CloseFundsWindowAction } from '../constants/actionTypes'
import '../scss/FundsModalWindow.scss'
import Wallets from '../wallets/Wallets'

interface StateProps {
  isFundsWindowOpen: boolean,
}

const mapStateToProps = (state: RootState):StateProps => ({
  isFundsWindowOpen: state.fundsWindow.isOpen,
})

const mapDispatchToProps = (dispatch:any) => ({
  closeFundsWindow: ():CloseFundsWindowAction => dispatch(closeFundsWindow()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const FundsWindowConnected = ({ isFundsWindowOpen, closeFundsWindow }:PropsFromRedux) => {
  return (
    <>
    <div className="modal-backdrop" onClick={() => closeFundsWindow()} />
    <div className="modal account-modal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Account</h5>
            <button type="button" className="close" onClick={() => closeFundsWindow()}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Wallets />
          </div>
        </div>
      </div>
    </div>
    </>

    // <>
    // <div className="modal-backdrop" onClick={() => closeFundsWindow()} />
    // <div className="modal-main main-tab">
    //   <Wallets />
    //   <div style={{ textAlign: 'right' }}>
    //     <button className="wallet-button"
    //       onClick={() => closeFundsWindow()}
    //       style={{ margin: '3px 10px 10px 10px'}}
    //     >
    //       Close
    //     </button>
    //   </div>
    // </div>
    // </>
  )
}
const FundsWindowModal = connector(FundsWindowConnected)

const FundsWindow = ({ isFundsWindowOpen, closeFundsWindow }:PropsFromRedux) => {
  if (!isFundsWindowOpen) return null

  return ReactDOM.createPortal(
    <FundsWindowModal />
    , document.body
  )
}

export default connector(FundsWindow)
