declare module "react-dom" {
  function createRoot(
    node: HTMLElement,
    options: { hydrate?: boolean },
  ): { render: (n: JSX.Element) => void }
}
