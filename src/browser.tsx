import React from "react"
import ReactDOM from "react-dom"
import {
  Provider,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange
} from "urql"

import { App } from "./App"

const IS_PROD = process.env.NODE_ENV === "production"

main()

export function main() {
  if (typeof window !== "undefined") {
    let initialState = safeGetInitialState()
    let client = createClient({
      url: "https://graphql-pokemon.now.sh/",
      /** Suspense is cool and all, but it breaks things... I guess */
      suspense: true,
      exchanges: [
        dedupExchange,
        cacheExchange,
        // Put the exchange returned by calling ssrExchange after your cacheExchange,
        // but before any asynchronous exchanges like the fetchExchange:
        initialState && ssrExchange({ initialState }),
        fetchExchange
      ].filter(Boolean)
    })

    let root = document.getElementById("root")

    let app = (
      <Provider value={client}>
        <App />
      </Provider>
    )
    ReactDOM.createRoot(root, { hydrate: IS_PROD }).render(app)
  }
}

function safeGetInitialState() {
  try {
    if ("URQL_DATA" in window && typeof window.URQL_DATA === "string") {
      return JSON.parse(window.URQL_DATA)
    }
  } catch (error) {
    console.warn("Unable to get the initial urql state from the server")
  }
}
