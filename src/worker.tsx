import React from "react"
import ReactDOMServer from "react-dom/server"
import prePass from "react-ssr-prepass"
import {
  Provider,
  Client,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange
} from "urql"
import jsesc from "jsesc"
import emo from "node-emoji"

import { App } from "./App"

let getRandomEmoji = (): string => emo.random().emoji

const htmlHeader = `<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="utf-8" />
    <link rel="icon" href="data:,">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
  <div id="root">`

const htmlFooter = `</div>
<script src="./browser.js"></script>
</body></html>
`

const JSESC_OPTS = {
  json: true,
  isScriptContext: true,
  wrap: true
}

const makeFooter = ({
  runtime,
  main,
  react,
  dataMgmt,
  emojiSet,
  urqlData
}) => `</div>
${
  urqlData
    ? `<script>window.URQL_DATA=${jsesc(
        JSON.stringify(urqlData),
        JSESC_OPTS
      )}</script>`
    : ""
}
<script>window.EMOJI_SET=${jsesc(JSON.stringify(emojiSet), JSESC_OPTS)}</script>
<script>{${runtime}}</script>
<script>{${dataMgmt}}</script>
<script>{${react}}</script>
<script>{${main}}</script>
</body></html>
`

async function handleRequest(event) {
  // Read all modules as raw script strings - inlining for now until static hosting figured out
  const [runtime, main, react, dataMgmt] = await Promise.all([
    WEB_ASSETS.get<string>("runtime.js"),
    WEB_ASSETS.get<string>("main.js"),
    WEB_ASSETS.get<string>("react.js"),
    WEB_ASSETS.get<string>("data-mgmt.js")
  ])

  let emojiSet = []

  for (let i = 0; i < 20; i++) {
    emojiSet.push(getRandomEmoji())
  }

  const ssrCache = ssrExchange()

  const client = new Client({
    suspense: true,
    exchanges: [
      dedupExchange,
      cacheExchange,
      // Put the exchange returned by calling ssrExchange after your cacheExchange,
      // but before any asynchronous exchanges like the fetchExchange:
      ssrCache,
      fetchExchange
    ],
    url: "https://graphql-pokemon.now.sh/"
  })

  let app = (
    <Provider value={client}>
      <App emojiSet={emojiSet} />
    </Provider>
  )

  await prePass(app)

  const urqlData = ssrCache.extractData()

  const stringApp = ReactDOMServer.renderToString(app)

  return new Response(
    htmlHeader +
      stringApp +
      makeFooter({ runtime, main, react, dataMgmt, emojiSet, urqlData }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  )
}

const endsWithFileExtension = (path: string): boolean => /\.\w{1,5}$/.test(path)

self.addEventListener("fetch", async event => {
  let requestedPathEndsWithFileExtension = endsWithFileExtension(
    event.request.url
  )

  if (!requestedPathEndsWithFileExtension) {
    event.respondWith(handleRequest(event))
  }
})
