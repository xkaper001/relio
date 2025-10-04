declare module 'mammoth' {
  interface Result {
    value: string
    messages: any[]
  }

  export function extractRawText(options: { buffer: Buffer }): Promise<Result>
}

declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: number): Promise<string>
  export function compare(data: string, encrypted: string): Promise<boolean>
}
