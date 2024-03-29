const keys = {
    left:       37,
    up:         38,
    right:      39,
    down:       40,
    inventory:  73,
    select:     13,
    back:       27,
}

degreesToRadians = degrees => {
    let pi = Math.PI;
    return degrees * (pi/180);
}

radiansToDegrees = radians => {
    let pi = Math.PI;
    return radians * (180/pi);
}

onResizeCalled = () => {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}

promiseDefault = fun => {
    return new Promise((res, rej) => {
        res(fun)
    })
}
