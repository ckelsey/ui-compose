export default function Debounce(func: Function, wait: number, immediate?: boolean) {
    let timer: any

    return function () {
        // @ts-ignore
        const context = this
        const args = arguments
        const callNow = immediate && !timer
        const later = function () {
            timer = requestAnimationFrame(function () {
                timer = null
                if (!immediate) func.apply(context, args)
            })
        }

        clearTimeout(timer)
        cancelAnimationFrame(timer)

        timer = setTimeout(later, wait)

        if (callNow) { func.apply(context, args) }
    }
}