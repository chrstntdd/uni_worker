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
import { setPragma } from "goober"

import { ModesExplainer } from "./ModesExplainer"
import { App } from "./App"

const IS_PROD = process.env.NODE_ENV === "production"

main()

export function main() {
  if (typeof window !== "undefined") {
    setPragma(React.createElement)
    let modeQuery = window.location.search
      .replace("?", "")
      .trim() as React.ComponentProps<typeof ModesExplainer>["activeMode"]
    let initialState = safeGetInitialState()
    let client = createClient({
      url: "https://graphql-pokemon.now.sh/",
      /** Suspense is cool and all, but it breaks things... I guess */
      suspense: modeQuery === "concurrent",
      exchanges: [
        dedupExchange,
        cacheExchange,
        // Put the exchange returned by calling ssrExchange after your cacheExchange,
        // but before any asynchronous exchanges like the fetchExchange:
        ssrExchange({ initialState }),
        fetchExchange
      ].filter(Boolean)
    })

    let root = document.getElementById("root")

    let makeApp = explainer => (
      <Provider value={client}>
        <App />
        {explainer}
      </Provider>
    )

    // \\\\\\\\\\\\\\\\
    switch (modeQuery) {
      case "concurrent":
        ReactDOM.createRoot(root, { hydrate: IS_PROD }).render(
          makeApp(<ModesExplainer activeMode={modeQuery} />)
        )

        break

      case "blocking":
        ReactDOM.createBlockingRoot(root, { hydrate: IS_PROD }).render(
          makeApp(<ModesExplainer activeMode={modeQuery} />)
        )
        break

      case "legacy":
      default:
        let makeWorld = IS_PROD ? ReactDOM.hydrate : ReactDOM.render
        makeWorld(
          makeApp(<ModesExplainer activeMode={modeQuery || "legacy"} />),
          root
        )
        break
    }
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
