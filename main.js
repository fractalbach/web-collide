
// Math.randint behavior mirrors that of python's random.randint
// Returns number R such that min <= R <= max
Math['randint'] = (min, max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Math['randintNorm'] = (min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    let r = (Math.random() + Math.random()) / 2;
    return Math.floor(r * (max - min + 1)) + min;
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// global object for debugging convenience.
let game = {};

// encapuslated program content.
(function(){

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx = 0;
        this.vy = 0;
        this.strokeStyle = 'black';
        this.fillStyle = 'white';
        // this.path = new Path2D();
        // this.path.arc(x, y, r, 0, 2*Math.PI);
    }
    draw(ctx) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
    clear() {
        let w = this.canvas.width;
        let h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
    }
    display() {
        for (let v of this.objects.values()) {
            v.draw(this.ctx);
        }
    }
    update() {
        let w = this.canvas.width;
        let h = this.canvas.height;
        let toohigh = false;
        let toolow = false;
        for (let o of this.objects.values()) {
            o.x = o.x + o.vx;
            o.y = o.y + o.vy;
            toohigh = (o.x > w);
            toolow = (o.x < 0);
            if (toohigh===true || toolow===true) {
                if (toohigh) {o.x = w - 2*(o.x - w);}
                if (toolow)  {o.x = -o.x;}
                o.vx = (-o.vx)
            }
            toohigh = (o.y > h);
            toolow = (o.y < 0);
            if (toohigh===true || toolow===true) {
                if (toohigh) {o.y = h - 2*(o.y - h);}
                if (toolow)  {o.y = -o.y;}
                o.vy = (-o.vy)
            }
        }
    }
}

function addRandomCircles(scene) {
    let w = scene.canvas.width;
    let h = scene.canvas.height;
    let n = 100;
    for (let i=0; i<n; i++) {
        let r = Math.randintNorm(w/100, w/25);
        let x = Math.randint(0+r, w-r);
        let y = Math.randint(0+r, h-r);
        let o = new Circle(x, y, r);
        o.fillStyle = getRandomColor();
        o.vx = (2*Math.random()-0.5) * 3;
        o.vy = (2*Math.random()-0.5) * 3;
        let key = i;
        scene.add(key, o);
    }
}

function main() {
    let scene = new Scene('#mainCanvas');
    addRandomCircles(scene);
    scene.display();
    game = scene;

    function loop() {
        scene.update();
        scene.clear();
        scene.display();
        window.requestAnimationFrame(loop);
    }
    loop();
}


window.addEventListener('load', main, false);
}());
