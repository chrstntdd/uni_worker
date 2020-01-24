import React from "react"

let getRandomEmoji = (set: any[]) => set[Math.floor(Math.random() * set.length)]

function safeGetEmojiState() {
  try {
    if (
      typeof window !== "undefined" &&
      "EMOJI_SET" in window &&
      typeof window.EMOJI_SET === "string"
    ) {
      return JSON.parse(window.EMOJI_SET)
    }
    return []
  } catch (error) {
    console.warn("Unable to get the initial emoji state from the server")
  }
}

function RandomEmoji() {
  let [emojis] = React.useState(safeGetEmojiState)
  let [randomEmoji, setRandomEmoji] = React.useState<string>(() =>
    getRandomEmoji(emojis)
  )

  return (
    <div>
      <button
        onClick={() => {
          setRandomEmoji(getRandomEmoji(emojis))
        }}
      >
        Get another random emoji
      </button>
      A random emoji {randomEmoji}
    </div>
  )
}

export { RandomEmoji }
