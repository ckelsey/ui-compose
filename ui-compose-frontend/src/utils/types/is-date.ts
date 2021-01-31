/**
 * Determines if a value is or can be a valid date
 * @function IsDate
 * @param {any} value - The value to test
 * @return (boolean) If the value is a valid date
 * @example 
 * IsDate('Mon Nov 18 2019 07:41:48 GMT-0800') // true
 * IsDate('Not a date') // false
 */

const isDate = (value: any) => value instanceof Date && !isNaN(value as any)

export default function IsDate(value: any): boolean {
    return isDate(new Date(value))
}