import 'egg'

declare module 'egg' {}

declare module '*.svg' {
  const path: string
  export default path
}

declare module '*.bmp' {
  const path: string
  export default path
}

declare module '*.gif' {
  const path: string
  export default path
}

declare module '*.jpg' {
  const path: string
  export default path
}

declare module '*.jpeg' {
  const path: string
  export default path
}

declare module '*.png' {
  const path: string
  export default path
}

declare module '*.css'
declare module '*.less'

declare module '*.json' {
  const content: Record<string, unknown>
  export default content
}

declare const __SERVER_ORIGIN__: string
declare const __IS_DEV_MODE__: boolean
