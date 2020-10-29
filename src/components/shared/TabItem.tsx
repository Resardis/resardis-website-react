import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { activateTab } from '../../actions'
import { ActivationPayload } from '../../constants/actionTypes'
import { RootState } from '../../reducers'

export interface Item {
  key: string,
  title: string,
}

interface OwnProps {
  tabbedNavigationName: string,
  item: Item,
}

interface StateProps {
  active: boolean,
}

const mapDispatchToProps = (dispatch:any) => ({
  activateTab: (payload:ActivationPayload) => dispatch(activateTab(payload))
})

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => (
  { active: state.activeTabs[ownProps.tabbedNavigationName] === ownProps.item.key}
)

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const TabItem = (props: Props) => (
  <li className="nav-item">
    <a
      className={"nav-link" + (props.active ? " active" : "")}
      onClick={() => props.activateTab({ [props.tabbedNavigationName]: props.item.key })}
      role="tab"
      href="#"
    >
      {props.item.title}
    </a>
  </li>
  // <div
  //   className={"tabbed-nav-item tabbed-nav-item-" + (props.active ? "active" : "inactive")}
  //   onClick={() => props.activateTab({ [props.tabbedNavigationName]: props.item.key })}
  // >
  //   {props.item.title}
  // </div>
)

export default connector(TabItem)
