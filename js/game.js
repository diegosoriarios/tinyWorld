const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

window.addEventListener("resize", onResizeCalled, false);

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight
let selected = -1
let itemSelection = 0
let inventoryIsOpen = false

let worldImage

let inventory = [
    {type: 'watter', qtd: 1},
    {type: '', qtd: 2},
    {type: '', qtd: 3},
    {type: '', qtd: 0},
    {type: '', qtd: 0},
]

const itemsAvailable = [
    {'tree': 'green'},
    {'food': 'red'},
    {'watter': 'blue'},
    {'vulcan': 'brown'},
    {'mountain': 'white'}
]

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
        ctx.fillRect((building.x * 2) - WIDTH / 2, (building.y) + (building.h / -4) + 16, building.w, building.h);
        ctx.closePath();
        ctx.translate(-WIDTH / 2, -HEIGHT / 2);
        ctx.restore();
    })

    inventory.forEach((item, i) => {
        ctx.fillStyle = "white"
        ctx.fillRect(16 + ((i * 72)), 32, 64, 64)
        ctx.fillStyle = "black"
        ctx.font = "20px Arial"
        if(item.qtd > 0) {
            ctx.fillText(item.qtd, 16 + ((i * 72)) + 48, 84)
        }
    })

    if(inventoryIsOpen) {
        ctx.fillStyle = "rgba(0, 0,225,0.5)"
        ctx.fillRect(16 + ((itemSelection * 72)), 32, 64, 64)
    }

    //Objeto selecionado
    ctx.strokeStyle = "white"
    ctx.strokeRect(16, 106, 64, 64)

    if(selected !== -1) {
        ctx.fillStyle = "red"
        ctx.fillRect(16, 106, 64, 64)
    }
}

update = () => {
    draw()

    requestAnimationFrame(update)
}

onKeyDown = e => {
    switch(e.keyCode) {
        case keys.left:
            if(!inventoryIsOpen) {
                world.angle += 15
                if(world.angle === 360) {
                    world.angle = 0
                }
                world.buildings.forEach(building => {
                    building.angle += .15 + Math.PI / 180;
                    building.angle %= 2 * Math.PI;
                })
            } else {
                if(itemSelection === 0) {
                    itemSelection = inventory.length - 1 
                } else {
                    itemSelection--
                }
            }
            //console.log(radiansToDegrees(world.buildings[0].angle))
            break
        case keys.up:
            removeItem()
            break
        case keys.right:
            if(!inventoryIsOpen) {
                world.angle -= 15
                if(world.angle === -360) {
                    world.angle = 0
                }
                world.buildings.forEach(building => {
                    building.angle += -.15 + Math.PI / 180;
                    building.angle %= 2 * Math.PI;
                })
            } else {
                if(itemSelection === inventory.length - 1 ) {
                    itemSelection = 0
                } else {
                    itemSelection++
                }
            }
            break
        case keys.down: // DOWN
            selected = 0
            if(selected === -1) { 
                createItem() 
            } else  {
                let promise = promiseDefault(world.buildings.some(x => { return radiansToDegrees(x.angle) >= 350 || radiansToDegrees(x.angle) <= 10 }))
                
                promise.then(res => {
                    if(!res) {
                        createItem(selected = selected)
                        inventory[selected].qtd--
                        for(let i = selected; i < inventory.length - 1; i++) {
                            if(inventory[i].qtd === 0) {
                                let aux = inventory[i]
                                inventory[i] = inventory[i+1]
                                inventory[i+1] = aux
                            }
                        }
                    } else {
                        alert('Tem algo aqui')
                    }
                })
            }
            break
        case keys.inventory:
            inventoryIsOpen = !inventoryIsOpen
            break
        case keys.select:
            if(inventoryIsOpen) {
                selected = itemSelection
                alert(selected)
                inventoryIsOpen = false
            }
            break
        case keys.back:
            inventoryIsOpen = false
            selected = -1
            break
    }
}

createItem = (angle = 0, selected = -1) => {
    let choosedItem = selected === -1 ? itemsAvailable[Math.floor(Math.random() * itemsAvailable.length)] : itemsAvailable[selected]
    let item = {
        //x: WIDTH / 4 + 8, 
        x: player.x / 2 + 20,
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
        if(radiansToDegrees(building.angle) > 350 || radiansToDegrees(building.angle) < 10) {
            index = world.buildings.indexOf(building)
            getItem(building)
            if(building.qtd === 0) {
                world.buildings.splice(index, 1)
            }
        }
    })
}

getItem = element => {
    inventory.forEach(item => {
        if(item.qtd === 0) {
            item.type = element.type
            item.qtd++
        }
    })
}

init()