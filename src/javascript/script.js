// Create global variables
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth // Making sure the entire canvas covers the entire window
canvas.height = window.innerHeight
let particleArray = []; // Will contain all particle objects (size, color and cordinats)

// handle mouse cordinats
const mouse = {
    x: null,
    y: null,
    radius: 150 // size of the circle area around the mouse
}

// Only available inside an invent listener 
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.radius = 150;
    // console.log(mouse.x, mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana'; // <---- Here you can change the font size and family
ctx.fillText('A', 0, 30) // <---- Here you can change the content
// ctx.strokeStyle = 'white';
// ctx.strokeRect (0, 0, 100, 100);
const data = ctx.getImageData (0, 0, 100, 100);

// Create a blueprint to create particles
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
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    // calculate distance between current mouse positioning and partical positioning
    // Push away the particles that are too near the mouse
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        if (distance < 300) {
            this.x += forceDirectionX * 3;
            this.y += forceDirectionY * 3;
        } else {
            this.size = 3; // Connected to line 34
        }
    }
}

// Fill array with partial inits
function init () {
    particleArray = [];
    for (let i = 0; i < 1000; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
}

init();
console.log(particleArray);

// Create an animation loop, rerun canvas for eacg frame
function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();