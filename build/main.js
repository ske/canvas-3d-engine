"use strict";
var Demo;
(function (Demo) {
    class Screen {
        constructor(canvas) {
            this.ref = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            this.contextRef = canvas.getContext("2d");
        }
        context() {
            return this.contextRef;
        }
        getWidth() {
            return this.width;
        }
        getHeight() {
            return this.height;
        }
    }
    Demo.Screen = Screen;
})(Demo || (Demo = {}));
var elements;
(function (elements) {
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        static create(x, y) {
            return new Point(x, y);
        }
        add(p) {
            this.x += p.x;
            this.y += p.y;
            return this;
        }
        sub(p) {
            this.x -= p.x;
            this.y -= p.y;
            return this;
        }
    }
    elements.Point = Point;
})(elements || (elements = {}));
var elements;
(function (elements) {
    class Point3d {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        static create(x, y, z) {
            return new Point3d(x, y, z);
        }
        copyTo(point) {
            point.x = this.x;
            point.y = this.y;
            point.z = this.z;
        }
        add(point) {
            this.x += point.x;
            this.y += point.y;
            this.z += point.z;
        }
    }
    elements.Point3d = Point3d;
})(elements || (elements = {}));
var elements;
(function (elements) {
    class Color {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        static create(r, g, b, a) {
            return new Color(r, g, b, a);
        }
    }
    elements.Color = Color;
})(elements || (elements = {}));
var elements;
(function (elements) {
    class Pair {
        constructor(a, b) {
            this.a = a;
            this.b = b;
        }
    }
    elements.Pair = Pair;
})(elements || (elements = {}));
/// <reference path="./Point3d.ts" />
/// <reference path="./Pair.ts" />
var elements;
(function (elements) {
    class Cube {
        constructor(size) {
            this.size = size;
            const p1 = new elements.Point3d(-1, -1, -1);
            const p2 = new elements.Point3d(1, -1, -1);
            const p3 = new elements.Point3d(1, 1, -1);
            const p4 = new elements.Point3d(-1, 1, -1);
            const p5 = new elements.Point3d(-1, -1, 1);
            const p6 = new elements.Point3d(1, -1, 1);
            const p7 = new elements.Point3d(1, 1, 1);
            const p8 = new elements.Point3d(-1, 1, 1);
            const l1 = new elements.Pair(1, 2);
            const l2 = new elements.Pair(2, 3);
            const l3 = new elements.Pair(3, 4);
            const l4 = new elements.Pair(4, 1);
            const l5 = new elements.Pair(5, 6);
            const l6 = new elements.Pair(6, 7);
            const l7 = new elements.Pair(7, 8);
            const l8 = new elements.Pair(8, 5);
            const l9 = new elements.Pair(1, 5);
            const l10 = new elements.Pair(2, 6);
            const l11 = new elements.Pair(3, 7);
            const l12 = new elements.Pair(4, 8);
            this.lines = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12];
            this.points = [p1, p2, p3, p4, p5, p6, p7, p8];
            this.points.forEach((p) => {
                p.x = p.x * size;
                p.y = p.y * size;
                p.z = p.z * size;
            });
        }
        clone() {
            let clone = new Cube(this.size);
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].copyTo(clone.getPointByIndex(i + 1));
            }
            return clone;
        }
        getPoints() {
            return this.points;
        }
        getLines() {
            return this.lines;
        }
        getPointByIndex(i) {
            return this.points[i - 1];
        }
    }
    elements.Cube = Cube;
})(elements || (elements = {}));
/// <reference path="./Point3d.ts" />
var elements;
(function (elements) {
    class Scene {
        constructor(camera, cameraOrientation, surface) {
            this.camera = camera;
            this.cameraOrientation = cameraOrientation;
            this.surface = surface;
        }
    }
    elements.Scene = Scene;
})(elements || (elements = {}));
/// <reference path="./Point3d.ts" />
/// <reference path="./Point.ts" />
/// <reference path="./Scene.ts" />
var elements;
(function (elements) {
    class Transformer {
        constructor() { }
        rotateY(point, angle) {
            return elements.Point3d.create(point.z * Math.sin(angle) + point.x * Math.cos(angle), point.y, point.z * Math.cos(angle) - point.x * Math.sin(angle));
        }
        degreeToRad(degree) {
            const degree360 = 2 * Math.PI;
            return (degree / 360) * degree360;
        }
        perspectiveTransformTo2D(point, scene) {
            // when camera = (0,0,0) and cameraOrientation = (0,0,0) the transform is exactly as transform2D
            let x = point.x - scene.camera.x;
            let y = point.y - scene.camera.y;
            let z = point.z - scene.camera.z;
            let c = elements.Point3d.create(Math.cos(scene.cameraOrientation.x), Math.cos(scene.cameraOrientation.y), Math.cos(scene.cameraOrientation.z));
            let s = elements.Point3d.create(Math.sin(scene.cameraOrientation.x), Math.sin(scene.cameraOrientation.y), Math.sin(scene.cameraOrientation.z));
            let d = elements.Point3d.create(c.y * (s.z * y + c.z * x) - s.y * z, s.x * (c.y * z + s.y * (s.z * y + c.z * x)) + c.x * (c.z * y - s.z * x), c.x * (c.y * z + s.y * (s.z * y + c.z * x)) - s.x * (c.z * y - s.z * x));
            let transformedX = (scene.surface.z / d.z) * d.x + scene.surface.x;
            let transformedY = (scene.surface.z / d.z) * d.y + scene.surface.y;
            return elements.Point.create(transformedX, transformedY);
        }
    }
    elements.Transformer = Transformer;
})(elements || (elements = {}));
/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
var Demo;
(function (Demo) {
    var Color = elements.Color;
    class ScreenBuffer {
        /**
         * FIXME create class for dimension with prop w/h instead of using Point
         */
        constructor(document, dimensions, clear = true) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = dimensions.x;
            this.canvas.height = dimensions.y;
            this.width = dimensions.x;
            this.height = dimensions.y;
            if (clear) {
                this.getContext().clearRect(0, 0, this.width, this.height);
            }
            this.create();
        }
        getContext() {
            return this.canvas.getContext("2d");
        }
        validPosition(position) {
            if (!this.image)
                return false;
            if (position.x < 0 || position.y < 0)
                return false;
            if (position.x > this.width - 1 || position.y > this.height - 1)
                return false;
            return true;
        }
        putPixel(position, color) {
            if (!this.validPosition(position))
                return;
            let offset = (position.x + position.y * this.width) * 4;
            this.image.data[offset] = color.r;
            this.image.data[offset + 1] = color.g;
            this.image.data[offset + 2] = color.b;
            if (color.a) {
                this.image.data[offset + 3] = color.a;
            }
            else {
                this.image.data[offset + 3] = 255;
            }
        }
        getPixel(position) {
            if (!this.validPosition(position))
                return;
            let offset = (position.x + position.y * this.width) * 4;
            return Color.create(this.image.data[offset], this.image.data[offset + 1], this.image.data[offset + 2], this.image.data[offset + 3]);
        }
        paint(buffer) {
            if (this.image) {
                this.getContext().putImageData(this.image, 0, 0);
                buffer.drawImage(this.canvas, 0, 0);
            }
        }
        clear() {
            this.image.data.fill(0);
        }
        create() {
            this.image = this.getContext().getImageData(0, 0, this.width, this.height);
        }
    }
    Demo.ScreenBuffer = ScreenBuffer;
})(Demo || (Demo = {}));
/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
/// <reference path="./ScreenBuffer.ts" />
var Demo;
(function (Demo) {
    var Point = elements.Point;
    class Drawing {
        // TODO create vector/line class which contains the basic calculations for the given object type (length, multiplication, add, unit, etc)
        static line(buffer, p1, p2, color) {
            let x_len = Math.abs(p2.x - p1.x);
            let y_len = Math.abs(p2.y - p1.y);
            let vector = Point.create(p2.x - p1.x, p2.y - p1.y);
            let length = x_len > y_len ? x_len : y_len;
            let unitVector = Point.create(vector.x / length, vector.y / length);
            let x = Math.round(p1.x);
            let y = Math.round(p1.y);
            let iterations = x_len > y_len ? Math.round(x_len) : Math.round(y_len);
            let x_inc = x_len > y_len ? Math.sign(unitVector.x) : unitVector.x;
            let y_inc = x_len > y_len ? unitVector.y : Math.sign(unitVector.y);
            for (let i = 0; i < iterations + 1; i++) {
                buffer.putPixel(Point.create(Math.round(x), Math.round(y)), color);
                x += x_inc;
                y += y_inc;
            }
        }
    }
    Demo.Drawing = Drawing;
})(Demo || (Demo = {}));
var util;
(function (util) {
    const CreateEvent = (label) => {
        return {
            label: label,
            time: window.performance.now(),
        };
    };
    util.PrintEvents = (events) => {
        let offset;
        let data = [];
        for (let event of events) {
            if (!offset) {
                offset = event.time;
            }
            data.push(event.label + ": +" + (event.time - offset).toString());
        }
        console.log("evt", data.join("|"));
    };
    util.GetElapsedTime = (events) => {
        let from = events[0].time;
        let to = events[events.length - 1].time;
        return to - from;
    };
    class Profiler {
        constructor() {
            this.events = {};
        }
        static instance() {
            // FIXME jobb lenne factory?
            if (!this._instance) {
                this._instance = new Profiler();
            }
            return this._instance;
        }
        start(id) {
            this.events[id] = [CreateEvent("start")];
        }
        snapshot(id, label) {
            if (!this.events[id]) {
                return;
            }
            this.events[id].push(CreateEvent(label));
        }
        stop(id) {
            if (!this.events[id]) {
                return;
            }
            this.events[id].push(CreateEvent("stop"));
            return this.get(id);
        }
        get(id) {
            return this.events[id];
        }
    }
    util.Profiler = Profiler;
})(util || (util = {}));
/// <reference path="./Demo/Screen.ts" />
/// <reference path="./Demo/elements/Point.ts" />
/// <reference path="./Demo/elements/Point3d.ts" />
/// <reference path="./Demo/elements/Color.ts" />
/// <reference path="./Demo/elements/Cube.ts" />
/// <reference path="./Demo/elements/Scene.ts" />
/// <reference path="./Demo/elements/Transformer.ts" />
/// <reference path="./Demo/ScreenBuffer.ts" />
/// <reference path="./Demo/Drawing.ts" />
/// <reference path="./Demo/util/Profiler.ts" />
var Point = elements.Point;
var Point3d = elements.Point3d;
var Color = elements.Color;
var Cube = elements.Cube;
var Scene = elements.Scene;
var ScreenBuffer = Demo.ScreenBuffer;
var Drawing = Demo.Drawing;
var Profiler = util.Profiler;
var PrintEvents = util.PrintEvents;
var GetElapsedTime = util.GetElapsedTime;
class Main {
    constructor(screen) {
        this.screen = screen;
        let camera = Point3d.create(50, 220, 400);
        let cameraOrientation = Point3d.create(75, -25, 0);
        let surface = Point3d.create(25, 100, 400);
        this.scene = new Scene(camera, cameraOrientation, surface);
    }
    runTest() {
        this.buffer = new ScreenBuffer(document, Point.create(this.screen.getWidth(), this.screen.getHeight()));
        const cube = new Cube(90);
        this.cubeRotationTest(cube, 0);
        // this.pixelTest();
    }
    pixelTest() {
        const buffer = this.buffer;
        const color = new Color(255, 255, 255);
        buffer.putPixel(Point.create(10, 10), color);
        Drawing.line(buffer, Point.create(200, 250), Point.create(-100, -50), color);
        buffer.paint(this.screen.context());
    }
    cubeRotationTest(cube, angle) {
        Profiler.instance().start("CR");
        const t = new elements.Transformer();
        const w = this.screen.getWidth();
        const h = this.screen.getHeight();
        const screenOffset = new Point(w / 2 - 25, h / 2 - 25);
        Profiler.instance().snapshot("CR", "init");
        const buffer = this.buffer;
        buffer.clear();
        Profiler.instance().snapshot("CR", "buffer-cleared");
        const rotatedCube = this.rotateCube(cube, t.degreeToRad(angle));
        Profiler.instance().snapshot("CR", "rotated");
        const moveVector = Point3d.create(0, 95, 0);
        const movedCube = this.moveCube(rotatedCube, moveVector);
        Profiler.instance().snapshot("CR", "moved");
        this.drawAxes(screenOffset);
        Profiler.instance().snapshot("CR", "draw-1");
        this.drawCube(movedCube, screenOffset);
        Profiler.instance().snapshot("CR", "draw-2");
        this.screen.context().clearRect(0, 0, w, h);
        Profiler.instance().snapshot("CR", "cleared");
        buffer.paint(this.screen.context());
        Profiler.instance().snapshot("CR", "painted");
        angle += 2;
        let timers = Profiler.instance().stop("CR");
        this.screen.context().fillStyle = "#0f0";
        this.screen.context().font = "12px monospaced";
        this.screen
            .context()
            .fillText(Math.round(GetElapsedTime(timers)).toString(), 10, 10);
        if (angle < 20) {
            PrintEvents(timers);
        }
        const _this = this;
        setTimeout(() => {
            _this.cubeRotationTest(cube, angle);
        }, 50);
    }
    line(p1, p2, color) {
        if (!this.buffer)
            return;
        Demo.Drawing.line(this.buffer, p1, p2, color);
    }
    drawCanvasLine(from, to, color) {
        const ctx = this.screen.context();
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    /**
     * FIXME refactor to elements.Transformer
     * FIXME transform array of points instead of actual Cube instance
     */
    moveCube(cube, vector) {
        const moved = cube.clone();
        moved.getPoints().forEach((point) => {
            point.add(vector);
        });
        return moved;
    }
    /**
     * FIXME refactor to elements.Transformer
     * FIXME transform array of points instead of actual Cube instance
     */
    rotateCube(cube, angle) {
        const t = new elements.Transformer();
        const rotated = cube.clone();
        rotated.getPoints().forEach((point) => {
            const rotatedPoint = t.rotateY(point, angle);
            rotatedPoint.copyTo(point);
        });
        return rotated;
    }
    drawAxes(screenOffset) {
        const white = Color.create(140, 140, 140);
        const grey = Color.create(70, 70, 70);
        // axes
        let l = 300;
        let y1 = Point3d.create(0, l, 0);
        let y2 = Point3d.create(0, -1 * l, 0);
        this.line3d(y1, y2, white, screenOffset);
        let x1 = Point3d.create(l, 0, 0);
        let x2 = Point3d.create(-1 * l, 0, 0);
        this.line3d(x1, x2, white, screenOffset);
        let z1 = Point3d.create(0, 0, l);
        let z2 = Point3d.create(0, 0, -1 * l);
        this.line3d(z1, z2, white, screenOffset);
        // plane on x
        let l2 = 200;
        for (let i = -l2; i <= l2; i += 20) {
            let z1 = Point3d.create(i, 0, l2);
            let z2 = Point3d.create(i, 0, -l2);
            this.line3d(z1, z2, grey, screenOffset);
        }
        for (let i = -l2; i <= l2; i += 20) {
            let x1 = Point3d.create(l2, 0, i);
            let x2 = Point3d.create(-l2, 0, i);
            this.line3d(x1, x2, grey, screenOffset);
        }
    }
    /**
     * FIXME refactor to Demo.Drawing
     * FIXME transform array of points instead of actual Cube instance
     */
    line3d(a, b, color, screenOffset) {
        const t = new elements.Transformer();
        // FIXME mass transform object points then draw lines
        const p1 = t.perspectiveTransformTo2D(a, this.scene).add(screenOffset);
        const p2 = t.perspectiveTransformTo2D(b, this.scene).add(screenOffset);
        this.line(p1, p2, color);
    }
    /**
     * FIXME refactor to Demo.Drawing
     * FIXME draw any 3d object instead of actual Cube instance
     */
    drawCube(cube, screenOffset) {
        const t = new elements.Transformer();
        const white = Color.create(255, 255, 255);
        // FIXME mass transform points then draw 2d lines
        cube.getLines().forEach((pair) => {
            const p3d_1 = cube.getPointByIndex(pair.a);
            const p3d_2 = cube.getPointByIndex(pair.b);
            this.line3d(p3d_1, p3d_2, white, screenOffset);
        });
    }
}
/// <reference path="./Demo/Screen.ts" />
/// <reference path="./Main.ts" />
const styles = {
    html: {
        "background-color": "#444",
        color: "#eee",
    },
    body: {
        margin: "0px",
        padding: "0px",
    },
    canvas: {
        "background-color": "black",
        display: "flex",
        margin: "0 auto",
    },
};
function style(e) {
    let css = styles[e.tagName.toLowerCase()];
    if (css) {
        for (let k of Object.keys(css)) {
            let v = css[k];
            e.style.setProperty(k, v);
        }
    }
}
function init() {
    const html = document.querySelector("html");
    style(html);
    const body = html.querySelector("body");
    style(body);
    const canvas = document.createElement("canvas");
    style(canvas);
    canvas.width = 1280;
    canvas.height = 720;
    body.append(canvas);
    const screen = new Demo.Screen(canvas);
    const main = new Main(screen);
    main.runTest();
}
