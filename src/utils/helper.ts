export function stringToArray(value: string, sepatarator=',' as string): string[] {
    return value.split(sepatarator).map((arr: string) => arr.trim())
}