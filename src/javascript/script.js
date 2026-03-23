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
    console.log(mouse.x, mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana'; // <---- Here you can change the font size and family
ctx.fillText('A', 0, 40) // <---- Here you can change the content