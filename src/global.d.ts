declare global {
  declare module '*.less' {
    const content: Record<string, string>
    export default content
  }
}
export {}
