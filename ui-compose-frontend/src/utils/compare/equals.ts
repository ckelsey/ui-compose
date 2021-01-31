import Type from '../types/type'
import IsNonCollection from '../types/is-non-collection'

export default function Equals(value1: any, value2: any): boolean {
    const type = Type(value1)

    if (Type(value2) !== type) { return false }

    if (IsNonCollection(value1)) {
        return value2 === value1
    }

    if (type === 'boolean' && value1 !== value2) {
        return false
    }

    if (type === 'array' && value1.length !== value2.length) {
        return false
    }

    if (type === 'object' && Object.keys(value1).length !== Object.keys(value2).length) {
        return false
    }

    if (type === 'object' && value1.constructor !== value2.constructor) {
        return false
    }

    if (type === 'date') {
        let d = value1 === value2
        d = new Date(value1).getTime() === new Date(value2).getTime()
        return d
    }

    if (type === 'dom') {
        return value1.isEqualNode(value2)
    }

    // Start walking

    if (type === 'array') {
        let len = value1.length

        while (len--) {
            if (!Equals(value1[len], value2[len])) {
                return false
            }
        }
    }

    if (type === 'object') {
        const keys = Object.keys(value1)
        let len = keys.length

        while (len--) {
            if (!Equals(value1[keys[len]], value2[keys[len]])) {
                return false
            }
        }
    }

    return true
}