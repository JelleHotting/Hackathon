// Create global variables
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth // Making sure the entire canvas covers the entire window
canvas.height = window.innerHeight
let particleArray = []; // Will contain all particle objects (size, color and cordinats)

// Handle mouse cordinats
const mouse = {
    x: null,
    y: null,
    radius: 250 // Here you can change the size of the circle area around the mouse
}

// Event: add a radius to the mouse
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.radius = 50;
})

// Create a separate canvas for the text to be able to place it in the center
const textCanvas = document.createElement('canvas');
const textStyling = textCanvas.getContext('2d');
textCanvas.width = 200;
textCanvas.height = 200;

// Styling text
textStyling.fillStyle = 'white';
textStyling.font = '12px Verdana';
textStyling.textAlign = 'center';
textStyling.textBaseline = 'middle';
textStyling.fillText('Xplorer', textCanvas.width / 2, textCanvas.height / 2);

// Calculation of the size of the text
const textCoordinates = textStyling.getImageData(0, 0, textCanvas.width, textCanvas.height); // ← Uitlezen van het tijdelijke canvas

// Create a blueprint to create particles
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1; // Here you can change the size per particle
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 40) + 5; // Here you can change the speed of the particles avoiding the mouse
    }

    // Draws the particles
    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); //position and radius
        ctx.closePath();
        ctx.fill();
    }

    // Calculates the distance between the positioning of the current mouse and positioning of the partical
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
        
        // If the particle is within the radius of the mouse, it will be pushed away
        if (distance < mouse.radius) {
            this.x -= DirectionX;
            this.y -= DirectionY;
        } 
        
        // If the particles are no longer inside the radius of the mouse, they will return to their original place
        else {
            
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10; // Here you can change the speed of the particles returning to their original place
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10; // Here you can change the speed of the particles returning to their original place
            }
        }
    }
}

// TextCoordinates reads the pixeldata from the text on the canvas and turns it into particles 
function init () {
    particleArray = [];
    const offsetX = canvas.width / 2 - textCanvas.width / 2 * 5;  
    const offsetY = canvas.height / 2 - textCanvas.height / 2 * 5; 

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 75) { // Here you can change the oppacity of the visible particles
                let positionX = x;
                let positionY = y;

                // If the particles are within the radius of the mouse, there will be a formula that changes the cordinates per partical which will give each an unique placement
                particleArray.push(new Particle( 
                    positionX * 5 + offsetX, // Here you can change the distance between the paritcles
                    positionY * 5 + offsetY // Here you can change the distance between the paritcles
                )); 
            }
        }
    }
}

init();
console.log(particleArray);

// Create an animation loop, reruns the canvas for each frame
function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();