declare module 'copy-paste' {
  export function copy(text: string, callback?: (err?: Error) => void): void;
  export function paste(callback: (err: Error | null, data: string) => void): void;
}