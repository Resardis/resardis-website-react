import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { EthereumProvider, TheGraphProvider } from './components'
import './index.css'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import store from './store'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.resardis.com/subgraphs/name/resardis/testnet',
  }),
  cache: new InMemoryCache(),

});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>

    <Provider store={store}>

      <EthereumProvider />
      <TheGraphProvider client={client} />

      <App />
    </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

