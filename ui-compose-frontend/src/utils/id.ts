let index: number = 0

function doId(indx: number) {
    return doHash() + indx
}

function doHash(): string {
    return (performance.now() + 'xxxxxxxxxxxxxxxx')
        .replace(
            /[x]|\./g,
            function () {
                return (Math.random() * 16 | 0).toString(16)
            }
        )
}

export default function ID() {
    index = index + 1
    return doId(index)
}