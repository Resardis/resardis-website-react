import React from 'react'
import './App.css'

import {
  Graph,
  Header,
  Markets,
  OrderForm,
  SelectedMarket,
  UserData,
} from './components'

const App = () => {
  return (
    <div className="main-grid">
      <Header />
      <SelectedMarket />
      <Graph />
      <OrderForm />
      <UserData />
      <Markets/>
    </div>
  )
}

export default App;
