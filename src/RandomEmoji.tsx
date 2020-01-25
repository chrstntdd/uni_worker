import React from "react"

let getRandomEmoji = (set: any[]) => set[Math.floor(Math.random() * set.length)]

function safeGetEmojiState(): string[] {
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

const defaultEmojiSet = preval`
let emo = require("node-emoji")
let emojiSet = []

for (let i = 0; i < 20; i++) {
  emojiSet.push(emo.random().emoji)
}
module.exports = emojiSet
`

function RandomEmoji() {
  let [emojis, setEmojis] = React.useState(safeGetEmojiState)
  let [randomEmoji, setRandomEmoji] = React.useState<string>(() =>
    getRandomEmoji(emojis)
  )

  React.useEffect(() => {
    if (emojis.length < 1) {
      setEmojis(defaultEmojiSet)
      setRandomEmoji(defaultEmojiSet[0])
    }
  }, [])

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
