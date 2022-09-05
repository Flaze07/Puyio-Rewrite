function getRowNum() {
    let e = new Error();
    e = e.stack.split("\n")[2].split(":");
    e.pop();
    return e.pop();
}

function clamp(num, min, max) {
    return Math.min((Math.max(num, min)), max);
}

export {
    getRowNum,
    clamp
}