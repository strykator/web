import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {store} from '@/redux'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GQL_API_URL ?? '',
})

const authLink = setContext(async (_, {headers}) => {
  const token = store.getState()?.user.accessToken
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
