// canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const endscreen = document.querySelector('#endscreen')
const bigScoreEl = document.querySelector('#bigScoreEl')
const easy = document.querySelector('#easy')
const medium = document.querySelector('#medium')
const hard = document.querySelector('#hard')
const impossible = document.querySelector('#impossible')


// variables
const GRAVITY = 0.05
const FRICTION = 0.8
let hitbox = 0

// utility Functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

class Circle {
    constructor(x, y, radius, color, borderwidth, velocity) {
        this.x = x
        this.y = y 
        this.radius = radius
        this.borderwidth = borderwidth
        this.velocity = velocity
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.strokeStyle = "black"
        ctx.lineWidth = this.borderwidth
        ctx.stroke()
        ctx.closePath()
    }

    update() {
        this.draw()

        // keep circle in canvas
        if (this.x - this.radius + this.velocity.x < 0|| this.x + this.radius + this.velocity.x > canvas.width) {
            this.velocity.x = -this.velocity.x * FRICTION
        }
        if (this.y - this.radius + this.velocity.y < 0|| this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * FRICTION
            this.velocity.x = this.velocity.x * FRICTION
        }
        
        // update velocity
        if (this.y + this.radius < canvas.height) {
            this.velocity.y += GRAVITY
        }

        // update circle position
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Pipe {
    constructor(x, y, height, width, color, velocity) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
    }

    update() {
        this.draw()

        this.x += this.velocity.x
    }
}

// implementation
let mousePos = { x: undefined, y: undefined };

window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
});

let circle
let pipes

let velocity = {
    x: 0,
    y: 1
}

let pipeVelocity = {
    x: -1,
    y: 0
}

function init() {
    circle = new Circle(canvas.width/2, canvas.height/2, 30, 'red', 3, velocity)
    pipes = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
}

function pipespawn() {
    let pos = randomInt(-1, -1000)
    pipes.push(new Pipe(canvas.width-105, pos, 1000, 100, 'green', pipeVelocity)) 
    pipes.push(new Pipe(canvas.width-105, 1300+pos, 1000, 100, 'green', pipeVelocity)) 
}

function clamp(min, max, value) {
    if(value < min){
        return min
    }
    else if(value > max){
        return max
    }
    else{
        return value
    }
}

let animationId
let score = 0;
// animation loop
function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    circle.update() 
    pipes.forEach((pipe, index)=> {
        pipe.update()
        let distance = Math.sqrt((clamp(pipe.x, pipe.x+100, circle.x)-circle.x)**2 + (clamp(pipe.y, pipe.y+1000, circle.y)-circle.y)**2)
        if (distance < circle.radius)
        {
            cancelAnimationFrame(animationId)
            bigScoreEl.innerHTML = score
            endscreen.style.display = 'flex'
            clearInterval(timer)
        }
        if(circle.x > pipe.x && circle.x < pipe.x+1)
        {
            score+=0.5
            scoreEl.innerHTML = score
        }
        if(pipe.x+100 < 0)
        {
            pipes.splice(index, 1)
        }
    })
    
}

easy.addEventListener('click', () => {
    hitbox = 1000
    init()
    animate() 
    timer = setInterval(pipespawn, 4000)
    diffuculty.style.display = 'none'
})

medium.addEventListener('click', () => {
    hitbox = 10
    init()
    animate() 
    timer = setInterval(pipespawn, 4000)
    diffuculty.style.display = 'none'
})

hard.addEventListener('click', () => {
    hitbox = 0
    init()
    animate() 
    timer = setInterval(pipespawn, 4000)
    diffuculty.style.display = 'none'
})

impossible.addEventListener('click', () => {
    hitbox = -28
    init()
    animate() 
    timer = setInterval(pipespawn, 4000)
    diffuculty.style.display = 'none'
})

let timer
startGameBtn.addEventListener('click', () => {
    diffuculty.style.display = 'flex'
    endscreen.style.display = 'none'
})


addEventListener('click', () => {
    if (mousePos.x < circle.x +circle.radius+hitbox && mousePos.x > circle.x-circle.radius-hitbox && mousePos.y > circle.y-circle.radius-hitbox && mousePos.y < circle.y+circle.radius+hitbox)
    circle.velocity.y = -3
})

