// @ts-ignore
export declare global {
  /** Cloudflare KV namespace that we write our browser side JS and other assets to */
  const WEB_ASSETS: {
    get<ReturnTypeA>(keyName: string): Promise<ReturnTypeA>
  }

  /** Extending events to support the Cloudflare Workers API */
  interface Event {
    request: {
      url: string
    }
    respondWith: (r: Promise<Response>) => unknown
  }

  interface Window {
    URQL_DATA: string
    EMOJI_SET: string
  }
}
