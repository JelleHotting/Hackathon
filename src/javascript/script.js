const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Making sure the entire canvas covers the entire window
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Will contain all particle objects (size, color and cordinats)
let particleArray = [];

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150 // size of the circle area around the mouse
}

// Only available inside an invent listener 
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse.x, mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana'; // <---- Here you can change the font size and family
ctx.fillText('A', 0, 30) // <---- Here you can change the content
// ctx.strokeStyle = 'white';
// ctx.strokeRect (0, 0, 100, 100);
const data = ctx.getImageData (0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 1;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function init () {
    particleArray = [];
    particleArray.push(new Particle(50, 50));
    particleArray.push(new Particle(80, 50));
}

init();
console.log(particleArray);

function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        requestAnimationFrame(animate);
    }
}
animate();