function pyrange(end: number, start = 0) {
    return [...Array(end - start).keys()].map(i => i + start)
}

export { pyrange };