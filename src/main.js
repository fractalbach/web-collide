
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

function getRandomColorLowRed() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 2; i++) {
        color += letters[Math.floor(Math.random() * 5)];
    }
    for (let i = 0; i < 4; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// global object for debugging convenience.
let game = {};

// encapuslated program content.
(function(){
"use strict";

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
    hasCollision(b) {
        return (((this.x - b.x)**2 + (this.y - b.y)**2) <= (this.r + b.r)**2)
    }
    static compareX(a, b) {
        return (a.x - b.x);
    }
    static compareY(a, b) {
        return (a.y - b.y);
    }
    static lowX(o) {
        return o.x - o.r;
    }
    static lowY(o) {
        return o.y - o.r;
    }
    static highX(o) {
        return o.x + o.r;
    }
    static highY(o) {
        return o.y + o.r;
    }
}

class VerticalLine {
    constructor(x, h) {
        this.x = x;
        this.h = h;
    }
    draw(ctx) {
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, this.h);
        ctx.stroke();
    }
}

class Scene {
    constructor(canvasID) {
        this.canvas = document.querySelector(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.objects = new Map();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
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

            // x: too high
            if (o.x > w) {
                o.x  = (w - 2*(o.x - w));
                o.vx = (-o.vx);
            }

            // x: too low
            if (o.x < 0) {
                o.x  = (-o.x);
                o.vx = (-o.vx);
            }

            // y: too high
            if (o.y > h) {
                o.y  = (h - 2*(o.y - h));
                o.vy = (-o.vy)
            }

            // y: too low
            if (o.y < 0) {
                o.y  = (-o.y);
                o.vy = (-o.vy);
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
        o.fillStyle = getRandomColorLowRed();
        o.vx = (2*Math.random()-0.5) * 3;
        o.vy = (2*Math.random()-0.5) * 3;
        let key = i;
        scene.add(key, o);
    }
}


/** @function
 * @name Sweep
 *
 * Sweep will identify overlapping intervals in a sorted array.
 * The _low_ and _high_ functions should return a Number that correspond to
 * the lower and higher numbers of the interval: (lower, higher).
 * Sweep will return a set of object pairs: (object, object) that represent
 * pairs of colliding objects.
 *
 * @param {Array} arr - The sorted array containing objects.
 * @param {function} low - f:(object)=>Number   ~ the low number in interval.
 * @param {function} high - f:(object)=>Number  ~ the high number in interval.
 */
function sweep(arr, low, high) {
    let ret = [];
    let stack = [];
    for (let n of arr) {
        let L = low(n);
        let filterFunc = (v)=> (L <= high(v));
        stack = stack.filter(filterFunc);
        for (let x of stack) {
            ret.push([n, x]);
        }
        stack.push(n);
    }
    return ret;
}

function doubleSweep(scene) {
    let ret = [];
    let s = new Set();
    let arr = Array.from(scene.objects.values()).sort(Circle.compareX);
    let stack = [];
    for (let n of arr) {
        let L = Circle.lowX(n);
        let filterFunc = (v)=> (L <= Circle.highX(v));
        stack = stack.filter(filterFunc);
        for (let x of stack) {
            s.add(n);
            s.add(x);
        }
        stack.push(n);
    }
    arr = Array.from(s).sort(Circle.compareY);
    stack = [];
    for (let n of arr) {
        let L = Circle.lowY(n);
        let filterFunc = (v)=> (L <= Circle.highY(v));
        stack = stack.filter(filterFunc);
        for (let x of stack) {
            ret.push([n, x]);
        }
        stack.push(n);
    }
    return ret;
}


function drawVerticalBoxes(scene, low1, high1, low2, high2) {
    let x0 = Math.max(low1, low2);
    let xf = Math.min(high1, high2);
    let w = xf - x0;
    let h = scene.height;
    scene.ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
    scene.ctx.fillRect(x0, 0, w, h);
    // let v1 = new VerticalLine(x0, scene.height);
    // let v2 = new VerticalLine(xf, scene.height);
    // v1.draw(scene.ctx);
    // v2.draw(scene.ctx);
}


function drawHorizontalBoxes(scene, low1, high1, low2, high2) {
    let y0 = Math.max(low1, low2);
    let yf = Math.min(high1, high2);
    let w = scene.width;
    let h = yf - y0;
    scene.ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
    scene.ctx.fillRect(0, y0, w, h);
}


function exampleSorts(scene) {
    let size = scene.objects.size;
    let low = Circle.lowX;
    let high = Circle.highX;
    let arr = Array.from(scene.objects.values()).sort(Circle.compareX);
    arr = sweep(arr, low, high);
    for (let [a,b] of arr) {
        drawVerticalBoxes(scene, low(a), high(a), low(b), high(b));
    }
    low = Circle.lowY;
    high = Circle.highY;
    arr = Array.from(scene.objects.values()).sort(Circle.compareY);
    arr = sweep(arr, low, high);
    for (let [a,b] of arr) {
        drawHorizontalBoxes(scene, low(a), high(a), low(b), high(b));
    }
}


function example2(scene) {
    // let lowX = Circle.lowX;
    // let lowY = Circle.lowY;
    // let highX = Circle.highX;
    // let highY = Circle.highY;
    let ctx = scene.ctx;
    let arr = doubleSweep(scene);
    for (let [a,b] of arr) {
        if (a.hasCollision(b)) {
            // ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
            // ctx.fillRect(a.x, 0, (b.x - a.x), scene.height);
            // scene.ctx.fillRect(0, a.y, scene.width, (b.y - a.y));
            // scene.ctx.fillRect(0, a.y, scene.width, (b.y - a.y));
            ctx.fillStyle = 'rgba(250, 0, 0, 0.6)';
            ctx.fillRect(a.x, a.y, (b.x - a.x), (b.y -a.y));
            ctx.strokeStyle = 'white'
            ctx.strokeWidth = 10;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.strokeWidth = 1;
        }
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
        // exampleSorts(scene);
        example2(scene);
        window.requestAnimationFrame(loop);
    }
    loop();
}


window.addEventListener('load', main, false);
}());
