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

  /**
   * @description
   * Pre-evaluate some code at build time using babel.
   * The code passed to the template will not have transformations
   * applied to it - so things like path aliasing wont work.
   *
   * @see https://github.com/kentcdodds/babel-plugin-preval#usage
   */
  const preval: any
}
