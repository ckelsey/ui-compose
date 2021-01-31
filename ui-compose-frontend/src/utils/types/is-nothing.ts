export default function IsNothing(value: any) {
    return (
        value === null ||
        typeof value === 'undefined' ||
        value === false
    )
}