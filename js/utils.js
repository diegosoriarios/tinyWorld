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