
// Math.randint behavior mirrors that of python's random.randint
// Returns number R such that min <= R <= max
Math['randint'] = (min, max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// global object for debugging convenience.
let game = {};

// encapuslated program content.
(function(){

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.strokeStyle = 'black';
        this.fillStyle = 'white';
        this.path = new Path2D();
        this.path.arc(x, y, r, 0, 2*Math.PI);
    }
    draw(ctx) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.fill(this.path);
        ctx.stroke(this.path);
    }
}

class Scene {
    constructor(canvasID) {
        this.canvas = document.querySelector(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.objects = new Map();
    }
    add(key, item) {
        this.objects.set(key, item);
    }
    display() {
        for (let [k,v] of this.objects.entries()) {
            v.draw(this.ctx);
        }
    }
}

function addRandomCircles(scene) {
    let w = scene.canvas.width;
    let h = scene.canvas.height;
    let n = 100;
    for (let i=0; i<n; i++) {
        let r = Math.randint(10, 20);
        let x = Math.randint(0+r, w-r);
        let y = Math.randint(0+r, h-r);
        let o = new Circle(x, y, r);
        if (i%5 == 0) {
            o.fillStyle = 'rgba(0, 0, 50, 50)';
        }
        let key = i;
        scene.add(key, o);
    }
}

function main() {
    let scene = new Scene('#mainCanvas');
    addRandomCircles(scene);
    scene.display();
    game = scene;
}



window.addEventListener('load', main, false);
}());
