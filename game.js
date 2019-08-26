const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

let worldImage

const world = {
    //x: WIDTH / 2 - 128,
    //y: HEIGHT - 128,
    x: -WIDTH / 6,
    y: -WIDTH / 6,
    angle: 0,

    buildings: [
        {x: WIDTH / 6, y: -16, w: 128, h: 32, color: 'green'}
    ]
}

const player = {
    x: WIDTH / 2 - 32,
    y: HEIGHT / 2 - (WIDTH / 6) - 64,
    w: 64,
    h: 64,
}

init = () => {
    canvas.width = WIDTH
    canvas.height = HEIGHT

    worldImage = new Image()
    worldImage.src = './assets/world.png'
    worldImage.onload = () => {
        ctx.drawImage(worldImage, world.x, world.y, WIDTH / 3, WIDTH / 3)
    }

    window.addEventListener("keydown", onKeyDown, false)

    update()
}

draw = () => {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = "white"
    ctx.fillRect(player.x, player.y, player.w, player.h)

    ctx.save()
    ctx.translate(WIDTH / 2, HEIGHT / 2)
    ctx.rotate(world.angle * Math.PI/180)
    ctx.drawImage(worldImage, world.x, world.y, WIDTH / 3, WIDTH / 3)

    world.buildings.forEach(building => {
        ctx.rotate(world.angle + building.angle * Math.PI/180)
        ctx.fillStyle = building.color
        ctx.fillRect(building.x, building.y, building.w, building.h)
    })

    ctx.restore()
}

update = () => {
    draw()
    requestAnimationFrame(update)
}

onKeyDown = e => {
    switch(e.keyCode) {
        case 39:
            world.angle += 15
            break
        case 37:
            world.angle -= 15
            break
    }
}

init()