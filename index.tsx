import React from "react"
import ReactDOMServer from "react-dom/server"

function App({ name }) {
  return <div>Hello, {name} 👋</div>
}

const htmlHeader = `<!DOCTYPE html><html><head lang="en">
<meta charset="utf-8" />
<link rel="icon" href="data:,">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head><body><div id="root">`

const htmlFooter = `</div>
<script src="./worker.js"></script>
</body></html>
`

function handleRequest(event) {
  const app = ReactDOMServer.renderToString(<App name="World" />)

  return new Response(htmlHeader + app + htmlFooter, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event))
})

if (typeof window !== "undefined") {
  console.log("Hey, the  window is  defined!")
}
