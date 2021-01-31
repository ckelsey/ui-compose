/**
 * Determines if the value is an object
 * @function IsObject
 * @param {any} value 
 * @return {boolean} Whether or not the value is an object
 * @example
 * IsObject() // false
 * IsObject(()=>{}) // false
 * IsObject('') // false
 * IsObject(true) // false
 * IsObject(null) // false
 * IsObject(new Date()) // false
 * IsObject([]) // false
 * IsObject({}) // true
 */

export default function IsObject(value: any) {
    return (
        (typeof value).indexOf('object') > -1 &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date)
    )
}
