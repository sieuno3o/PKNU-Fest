// backend/src/types/jsonwebtoken.d.ts

declare module 'jsonwebtoken' {
  // 최소한으로 필요한 것들만 any로 선언
  export function sign(...args: any[]): any
  export function verify(...args: any[]): any
  export function decode(...args: any[]): any

  const _default: {
    sign: typeof sign
    verify: typeof verify
    decode: typeof decode
  }

  export default _default
}
