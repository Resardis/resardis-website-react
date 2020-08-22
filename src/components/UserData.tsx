import React from 'react'
import { TabbedNav } from './shared'
import {
  TAB_MENU_USERDATA,
  TAB_MENU_USERDATA_NAME,
} from '../constants/tabData'
import UserDataTabContent from './UserDataContent'
import '../css/UserData.css'

const UserData = () => (
  <div className="user-data main-tab">
    <TabbedNav items={TAB_MENU_USERDATA} tabbedNavigationName={TAB_MENU_USERDATA_NAME} />
    <div className="container">
      <div className="container container-inner" style={{ margin: 0 }}>
        <UserDataTabContent />
        <div style={{ minHeight: '12px' }}></div>
      </div>
    </div>
  </div>
)

export default UserData
