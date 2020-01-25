import React from "react"
import { useQuery } from "urql"

const getPokemans = `query GetPokemans($pokemon: String) {
  pokemon(name: $pokemon) {
    id
    number
    name
    image
    types
    attacks {
      special {
        name
        type
        damage
      }
    }
    evolutions {
      id
      number
      name
      image
      types
      weight {
        minimum
        maximum
      }
      attacks {
        fast {
          name
          type
          damage
        }
      }
    }
  }
}
`

const stripSpecialChars = (input: string) => input.replace(/[^\w\s-]+/gi, "")

function PokemonView(): any {
  const [pokemonName, setPokemonName] = React.useState("MewTwo")
  const [pokeQuery, setPokeQuery] = React.useState(pokemonName)
  const [res] = useQuery({
    query: getPokemans,
    variables: {
      pokemon: pokeQuery
    }
  })

  if (res.fetching) {
    return "Loading..."
  } else if (res.error) {
    return "Oh no!"
  }

  return (
    <>
      <form
        onSubmit={e => {
          console.log("SUBMITTING")
          e.preventDefault()
          setPokeQuery(pokemonName)
          // executeQuery({ requestPolicy: "network-only" })
        }}
      >
        <input
          type="text"
          onChange={e => {
            setPokemonName(stripSpecialChars(e.target.value))
          }}
        ></input>
      </form>
      <pre>
        <code>{JSON.stringify(res.data, null, 2)}</code>
      </pre>
    </>
  )
}

export { PokemonView }
