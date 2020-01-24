import React from "react"

import { PokemonView } from "./PokemonView"
import { RandomEmoji } from "./RandomEmoji"

function App(): any {
  return (
    <div>
      <RandomEmoji />
      <React.Suspense fallback={"We be waitin tho"}>
        <PokemonView />
      </React.Suspense>
    </div>
  )
}

export { App }
