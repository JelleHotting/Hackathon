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
    radius: 250 // size of the circle area around the mouse
}

// Only available inside an invent listener 
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.radius = 100;
    // console.log(mouse.x, mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '15px Verdana'; // <---- Here you can change the font size and family
ctx.fillText('Xplorer', 30, 30) // <---- Here you can change the content
// ctx.strokeStyle = 'white';
// ctx.strokeRect (0, 0, 100, 100);
const textCoordinates = ctx.getImageData (0, 0, 100, 100);

// Create a blueprint to create particles
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 40) + 5; // Speed of particles avoiding mouse
    }
    draw(){
        ctx.fillStyle = 'white';
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
        let DirectionX = forceDirectionX * force * this.density;
        let DirectionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
            this.x -= DirectionX;
            this.y -= DirectionY;
        } else {
            // Moves particles back to it's original place once the mouse is far away
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10; // Speed of returning particles
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10; // Speed of returning particles
            }
        }
    }
}

// Fill array with partial inits
function init () {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x;
                let positionY = y;
                particleArray.push(new Particle(positionX * 15, positionY * 15));
            }
        }
    }

    // for (let i = 0; i < 1000; i++) {
    //     let x = Math.random() * canvas.width;
    //     let y = Math.random() * canvas.height;
    //     particleArray.push(new Particle(x, y));
    // }
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