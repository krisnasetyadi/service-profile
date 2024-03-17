export function stringToArray(value: string, sepatarator=',' as string): string[] {
    return value.split(sepatarator).map((arr: string) => arr.trim())
}

export function formattedDateNow() {
    const currentDate = new Date
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    return `${year}${month}${day}`

}