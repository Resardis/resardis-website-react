import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { EthereumProvider, TheGraphProvider } from './components'
import { ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import store from './store'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'


const httpLink = new HttpLink({
  //    uri: 'https://graph.resardis.com/subgraphs/name/resardis/testnet',
  uri: 'https://graph-mumbai.resardis.com/subgraphs/name/resardis/dex-mumbai'
})

const wsLink = new WebSocketLink({
  uri: `wss://graph-mumbai.resardis.com:8001/subgraphs/name/resardis/dex-mumbai`,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})


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

