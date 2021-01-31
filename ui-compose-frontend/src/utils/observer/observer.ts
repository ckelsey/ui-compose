import ID from '../id'
import Type from '../types/type'
import Equals from '../compare/equals'
import Debounce from '../timing/debounce'

const emptyFn = (val?: any) => val

interface ObserverOptions {
    emitOnSubscribe?: boolean
    emitOnlyNew?: boolean
    completeOnNoSubscribers?: boolean
    matchType?: boolean,
    onSubscribe?: Function,
    formatter?: Function,
    takeFirst?: boolean,
    takeLast?: boolean
}

interface ObserverSubscriptionMethods {
    next: (value: any, state: ObserverState, id: string) => void
    error: (error?: any) => void
    unsubscribe: () => void
    complete: () => void
}

interface ObserverSubscription extends ObserverSubscriptionMethods {
    id: string
}

interface ObserverSubscriptions {
    [key: string]: ObserverSubscription
}

interface ObserverState extends ObserverOptions {
    errors: any[]
    updated: number
    subscriptions: ObserverSubscriptions
    isComplete: boolean
    initialType: string
    value?: any,
    previousValue?: any
}

interface ObserverResult {
    isComplete: boolean
    value: any
    previous: any
    subscriptions: ObserverSubscriptions
    lastUpdate: Number
    removed: any[]
    added: any[],
    next: (value: any, force: boolean) => void
    error: (error: any) => void
    complete: () => void
    insert: (element: any, index?: number) => void
    insertAll: (elements: any, index?: number | undefined) => void
    remove: (element: any, index?: number, all?: boolean) => void
    removeElements: (elements: any) => void
    reverse: () => void
    has: (value: any) => void
    indexOf: (value: any) => void
    subscribe: (
        next: (val: any, force?: boolean) => void,
        error?: (val: any) => void,
        complete?: () => void
    ) => () => void
}

function getRemoved(state: ObserverState): any[] {
    if (!state) { return [] }
    const current = state.value
    const previous = state.previousValue
    const removed: any[] = []

    if (!Array.isArray(current) || !Array.isArray(previous)) { return removed }

    previous.forEach(item => current.indexOf(item) === -1 ? removed.push(item) : undefined)

    return removed
}

function getAdded(state: ObserverState): any[] {
    if (!state) { return [] }
    const current = state.value
    const previous = state.previousValue
    const added: any[] = []

    if (!Array.isArray(current) || !Array.isArray(previous)) { return added }

    current.forEach(item => previous.indexOf(item) === -1 ? added.push(item) : undefined)

    return added
}

export default function Observer(
    initialValue: any,
    {
        emitOnSubscribe = true,
        emitOnlyNew = true,
        completeOnNoSubscribers = false,
        matchType = false,
        onSubscribe = () => { },
        formatter = (val: any) => val,
        takeFirst = false,
        takeLast = false
    }
        : ObserverOptions
): ObserverResult {

    const initialType = Type(formatter(initialValue))

    const formatValue = (toFormat: any) => {
        const f = formatter(toFormat)
        return matchType && Type(f) != initialType ? state.value : f
    }

    const states = [formatValue(initialValue)]

    const state: ObserverState = {
        errors: [],
        updated: new Date().getTime(),
        subscriptions: {},
        isComplete: false,
        initialType,
        formatter,
        matchType,
        emitOnlyNew,
        emitOnSubscribe,
        completeOnNoSubscribers,
        takeFirst,
        takeLast,
        get previousValue() { return states[1] },
        get value() { return states[0] },
        set value(v) {
            states.unshift(v)
            while (states.length > 2) { states.pop() }
        },
    }

    function destroy() {
        Object.keys(state.subscriptions).forEach(k => state.subscriptions[k].unsubscribe())

        Object.defineProperties(result, {
            value: { get: function () { return undefined } },
            previous: { get: function () { return undefined } },
            subscriptions: { get: function () { return undefined } },
            next: { value: emptyFn },
            error: { value: emptyFn },
            complete: { value: emptyFn },
            subscribe: { value: emptyFn },
            unsubscribe: { value: emptyFn },
            insert: { value: emptyFn },
            insertAll: { value: emptyFn },
            remove: { value: emptyFn },
            removeElements: { value: emptyFn },
            has: { value: emptyFn },
            indexOf: { value: emptyFn },
            reverse: { value: emptyFn },
            on: { value: emptyFn },
            trigger: { value: emptyFn },
        })

        state.isComplete = true
    }

    const doLoop = <K extends keyof ObserverSubscriptionMethods>(functionKey: K, val: any) => {
        const subs = state.subscriptions

        Object.keys(subs).forEach((id: string) => {
            const sub = subs[id]

            if (sub[functionKey] && typeof sub[functionKey] == 'function') {
                sub[functionKey](val, state, id)
            }
        })

        if (functionKey === 'complete') { destroy() }
    }

    const loop = !(!!takeFirst || !!takeLast) ? doLoop : Debounce(doLoop, 1000, !!takeFirst)

    const unsubscribe = (subscription: ObserverSubscription) => () => {
        delete state.subscriptions[subscription.id]

        if (completeOnNoSubscribers && Object.keys(state.subscriptions).length === 0) {
            destroy()
        }
    }


    function getArrayIndexOf(element: any, isArray: boolean): number | undefined {
        if (!isArray) { return }
        const index = state.value.indexOf(element)
        return index > -1 ? index : undefined
    }

    function getObjectKey(value: any) {
        let _result

        const keys = Object.keys(state.value)
        let i = keys.length

        while (i--) {
            if (value === state.value[keys[i]]) {
                _result = keys[i]
                break
            }
        }

        return _result
    }

    const result: ObserverResult = {
        get isComplete() { return state.isComplete },
        get value() { return state.value },
        get previous() { return state.previousValue },
        get subscriptions() { return state.subscriptions },
        get lastUpdate() { return state.updated },
        get removed() { return getRemoved(state) },
        get added() { return getAdded(state) },

        next: function (v, force) {
            const formatted = formatValue(v)

            if (!force && emitOnlyNew && Equals(formatted, state.value)) { return }

            state.value = formatted
            state.updated = new Date().getTime()

            loop('next', state.value)
            return state
        },

        error: function (err) {
            state.errors = state.errors.concat([err])
            state.updated = new Date().getTime()

            loop('error', err)

            result.complete()
        },

        complete: function () { loop('complete', state) },

        subscribe: (next: (val: any) => void, error = emptyFn, complete = () => { }) => {
            const subscription: ObserverSubscription = {
                next: next,
                error: error,
                complete: complete,
                id: ID(),
                unsubscribe: () => { }
            }

            subscription.unsubscribe = unsubscribe(subscription)
            state.subscriptions[subscription.id] = subscription

            if (emitOnSubscribe && state.value !== undefined && typeof subscription.next === 'function') {
                subscription.next(state.value, state, subscription.id)
            }

            onSubscribe(subscription)

            return subscription.unsubscribe
        },

        insert: (element: any, index?: number) => {
            if (index === undefined) {
                index = state.value.length
            }

            index = index || 0

            if (Array.isArray(state.value)) {
                state.value.splice(index, 0, element)
                return result.next(state.value, true)
            }

            if (typeof state.value === 'string') {
                return result.next(state.value.slice(0, index) + element + state.value.slice(index), true)
            }

            state.value[index] = element

            return result.next(state.value, true)
        },

        insertAll: (elements: any, index?: number | undefined) => {
            if (index === undefined) {
                index = state.value.length
            }

            index = index || 0

            if (Array.isArray(state.value)) {
                state.value.splice.apply(state.value, [index, 0, ...elements])
                return result.next(state.value, true)
            }

            Object.keys(elements).forEach(prop => state.value[prop] = elements[prop])

            return result.next(state.value, true)
        },

        remove: (element: any, index?: number, all?: boolean) => {
            const isArray = Array.isArray(state.value)
            const isString = typeof state.value === 'string'

            if (index === undefined) {
                index = getArrayIndexOf(element, isArray)
            }

            if (index === undefined && isArray) {
                return state.value
            }

            if (index === undefined && isString) {
                return result.next(state.value.replace(new RegExp(element, all ? 'gm' : ''), ''), true)
            }

            if (index !== undefined) {
                if (isArray) {
                    state.value.splice(index, 1)
                } else if (isString) {
                    state.value = state.value.slice(0, index)
                } else {
                    state.value[index] = undefined
                    delete state.value[index]
                }

                return result.next(state.value, true)
            }

            const objectKey = getObjectKey(element)

            if (objectKey !== undefined) {
                state.value[objectKey] = null
                delete state.value[objectKey]
                return result.next(state.value, true)
            }

            return result.next(state.value, true)
        },

        removeElements: (elements: any) => {
            if (Array.isArray(state.value)) {

                for (let i = 0; i < elements.length; i = i + 1) {
                    const index = state.value.indexOf(elements[i])
                    if (index > -1) {
                        state.value.splice(index, 1)
                    }
                }

                return result.next(state.value, true)
            }

            Object.keys(elements).forEach(prop => delete state.value[prop])

            return result.next(state.value, true)
        },

        reverse: () => {
            const isArray = Array.isArray(state.value)
            const isString = typeof state.value === 'string'

            if (isArray) {
                return result.next(state.value.reverse(), true)
            }

            if (isString) {
                return result.next(state.value.split('').reverse(), true)
            }

            result.next(state.value, true)
        },

        has: (value: any) => {
            const isArray = Array.isArray(state.value)
            const isString = typeof state.value === 'string'

            if (isArray) {
                return getArrayIndexOf(value, isArray) || false
            }

            if (isString) {
                return state.value.indexOf(value) > -1
            }

            const objectKey = getObjectKey(value)

            if (objectKey !== undefined) {
                return true
            }

            return false
        },

        indexOf: (value: any) => {
            const isArray = Array.isArray(state.value)
            const isString = typeof state.value === 'string'

            if (isArray) {
                return getArrayIndexOf(value, isArray) || -1
            }

            if (isString) {
                return state.value.indexOf(value)
            }

            return getObjectKey(value) || -1
        }
    }

    return result
}
