const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

let worldImage

degreesToRadians = degrees => {
    let pi = Math.PI;
    return degrees * (pi/180);
}

radiansToDegrees = radians => {
    let pi = Math.PI;
    return radians * (180/pi);
}

const world = {
    //x: WIDTH / 2 - 128,
    //y: HEIGHT - 128,
    x: -WIDTH / 6,
    y: -WIDTH / 6,
    angle: 0,

    buildings: []
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


    for(let i = 0; i < 360; i += 15) {
        if(Math.random() > .9) {
            createItem(degreesToRadians(i))
        }
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
    ctx.restore()

    world.buildings.forEach(building => {
        ctx.save();
        ctx.translate(WIDTH / 2, HEIGHT / 2);
        ctx.beginPath();
        ctx.rotate(building.angle);
        ctx.fillStyle = building.color;
        ctx.fillRect((building.x * 2) - WIDTH / 2, (building.y) + (building.h / -4), building.w, building.h);
        ctx.closePath();
        ctx.translate(-WIDTH / 2, -HEIGHT / 2);
        ctx.restore();
    })
}

update = () => {
    draw()

    requestAnimationFrame(update)
}

onKeyDown = e => {
    switch(e.keyCode) {
        case 37: // LEFT
            world.angle += 15
            if(world.angle === 360) {
                world.angle = 0
            }
            world.buildings.forEach(building => {
                building.angle += .15 + Math.PI / 180;
                building.angle %= 2 * Math.PI;
            })
            //console.log(radiansToDegrees(world.buildings[0].angle))
            break
        case 38: // UP
            removeItem()
            break
        case 39: // RIGHT
            world.angle -= 15
            if(world.angle === -360) {
                world.angle = 0
            }
            world.buildings.forEach(building => {
                building.angle += -.15 + Math.PI / 180;
                building.angle %= 2 * Math.PI;
            })
            console.log(world)
            break
        case 40: // DOWN
            createItem()
            break
    }
}

createItem = (angle = 0) => {
    let items = [
        {'tree': 'green'},
        {'food': 'red'},
        {'watter': 'blue'},
        {'vulcan': 'brown'},
        {'mountain': 'white'}
    ]
    let choosedItem = items[Math.floor(Math.random() * items.length)]
    let item = {
        x: WIDTH / 4 + 8, 
        y: (-HEIGHT / 2) + 112, 
        w: -32, 
        h: -128, 
        color: Object.values(choosedItem), 
        type: Object.keys(choosedItem),
        angle: angle
    }
    world.buildings.push(item)
}

removeItem = () => {
    world.buildings.forEach(building => {
        let index
        if(radiansToDegrees(building.angle) > 345 || radiansToDegrees(building.angle) < 15) {
            index = world.buildings.indexOf(building)
            world.buildings.splice(index, 1)
        }
    })
}

init()