const ctx = canvas.getContext("2d")

window.addEventListener("resize", onResizeCalled, false);

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight
let selected = -1
let itemSelection = 0
let inventoryIsOpen = false

let worldImage
let handImage

let inventory = [
    {type: 'apple', qtd: 1},
    {type: 'strawberry', qtd: 2},
    {type: '', qtd: 0},
    {type: '', qtd: 0},
    {type: '', qtd: 0},
]

const itemsAvailable = [
    {'tree': 'green'},
    {'apple': 'red'},
    {'strawberry': 'darkred'},
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

    handImage = new Image()
    handImage.src = './assets/hand.png'
    
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
        if(building.color !== 'green') {
            ctx.fillStyle = building.color;
            ctx.fillRect((building.x * 2) - WIDTH / 2, (building.y) + (building.h / -4) + 16, building.w, building.h);
        } else {
            let image = new Image()
            switch(building.color) {
                case 'green':
                    image.src = "./assets/pine.png"
                    break
                case 'red':
                    image.src = "./assets/apple.png"
                    break
                case 'darkred':
                    image.src = "./assets/strawberry.png"
            }
            ctx.drawImage(image, (building.x * 2) - WIDTH / 2, (building.y) + (building.h / -4) + 16, building.w - 32, building.h)
        }
        ctx.closePath();
        ctx.translate(-WIDTH / 2, -HEIGHT / 2);
        ctx.restore();
    })

    inventory.forEach((item, i) => {
        ctx.fillStyle = "white"
        ctx.fillRect(16 + ((i * 72)), 32, 64, 64)
        let image = new Image()
        switch(item.type) {
            case 'tree':
                image.src = "./assets/pine.png"
                break
            case 'apple':
                image.src = "./assets/apple.png"
                break
            case 'strawberry':
                image.src = "./assets/strawberry.png"
        }
        ctx.drawImage(image, 32 + ((i * 72)), 48, 32, 32)
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

    if(selected !== -1) {
        ctx.fillStyle = "red"
        ctx.fillRect(16, 106, 64, 64)
    } else {
        ctx.strokeStyle = "white"
        ctx.strokeRect(16, 106, 64, 64)
        ctx.drawImage(handImage, 16, 106, 64, 64)
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
            catchItems()
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
            if(selected === -1) {
                alert('Selecione algo antes')
            } else  {
                let promise = promiseDefault(world.buildings.some(x => { return radiansToDegrees(x.angle) >= 350 || radiansToDegrees(x.angle) <= 10 }))
                
                promise.then(res => {
                    if(!res) {
                        createItem(selected = selected)
                        inventory[selected].qtd--
                        for(let i = selected; i < inventory.length - 1; i++) {
                            if(inventory[i].qtd === 0) {
                                inventory[i].type = ""
                                let aux = inventory[i]
                                inventory[i] = inventory[i+1]
                                inventory[i+1] = aux
                            }
                        }

                        selected = -1
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
                if(inventory[itemSelection].type !== 0 && inventory[itemSelection].qtd !== 0) {
                    selected = itemSelection
                    alert(selected)
                    inventoryIsOpen = false
                } else {
                    console.log(inventory[itemSelection])
                }
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
    let image
    let item = {
        //x: WIDTH / 4 + 8, 
        x: player.x / 2 + 20,
        y: (-HEIGHT / 2) + 112, 
        w: -32, 
        h: -128, 
        color: JSON.stringify(Object.values(choosedItem)).replace(/"]|[["]/g, ''), 
        type: JSON.stringify(Object.keys(choosedItem)).replace(/"]|[["]/g, ''),
        angle: angle
    }
    world.buildings.push(item)
}

catchItems = () => {
    world.buildings.forEach(building => {
        if(radiansToDegrees(building.angle) > 350 || radiansToDegrees(building.angle) < 10) {
            let index = world.buildings.indexOf(building)
            getItem(building)
            world.buildings.splice(index, 1)
        }
    })
}

getItem = element => {
    let agroup = promiseDefault(inventory.find(item => item.type === element.type))

    agroup.then(item => {
        if(item !== undefined) {
            item.qtd++
        } else {
            promiseDefault(inventory.find(value => value.qtd === 0))
                .then(spot => {
                    if(spot !== undefined) {
                        spot.type = element.type
                        spot.qtd++
                    }
                }
            )
        }
    })
}

init()