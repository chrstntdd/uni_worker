import React from "react"
import { styled } from "goober"

const Details = styled("details")`
  background-color: white;
  position: fixed;
  bottom: 0;
  right: 0;
  border: 1px solid #aaa;
  border-radius: 0.4rem;
  padding: 0.6rem;
` as React.FC

const CopyContainer = styled("div")`
  width: 33vw;
  padding: 1rem;
` as React.FC

const CITE_STYLE = { fontStyle: "normal" } as const

type Props = {
  activeMode: "legacy" | "blocking" | "concurrent"
}

function ModesExplainer({ activeMode }: Props) {
  let [host, setHost] = React.useState("")

  React.useEffect(() => {
    setHost(window.location.host)
  }, [])

  return (
    <Details>
      <summary>
        ⚛ React Mode = {"\n"}
        {activeMode === "concurrent"
          ? "C O N C U R R E N T  ⏱"
          : activeMode === "blocking"
          ? "  🛡 Blocking"
          : "  🐎 Legacy"}
      </summary>
      <CopyContainer>
        This project is exploring React, specifically how the various modes
        affect rendering, updating, all that jazz. To toggle between the various
        modes, you can append a <code>?MODE_KIND</code> to the URL where{" "}
        <code>?MODE_KIND</code> is one of the following{" "}
        <code>legacy (default) | blocking | concurrent</code>.
        <br />
        <br />
        Examples:
        <ul>
          <li>
            <code>{host}?concurrent</code>
          </li>
          <li>
            <code>{host}?blocking</code>
          </li>
        </ul>
        <cite style={CITE_STYLE}>
          <a href="https://reactjs.org/docs/concurrent-mode-adoption.html#feature-comparison">
            React Docs
          </a>
        </cite>
      </CopyContainer>
    </Details>
  )
}

export { ModesExplainer }
