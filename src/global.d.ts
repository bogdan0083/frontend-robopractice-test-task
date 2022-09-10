declare global {
  export interface Window {
    foo: number
  }
  declare module '*.less' {
    const content: Record<string, string>
    export default content
  }
}
export {}
