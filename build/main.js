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
        clear() {
            this.contextRef.clearRect(0, 0, this.getWidth(), this.getHeight());
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
        rounded() {
            return Point.create(Math.round(this.x), Math.round(this.y));
        }
        clone() {
            return Point.create(this.x, this.y);
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
        addX(value) {
            this.x += value;
        }
        addY(value) {
            this.y += value;
        }
        addZ(value) {
            this.z += value;
        }
        clone() {
            return new Point3d(this.x, this.y, this.z);
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
        getCameraOrientation() {
            return this.cameraOrientation;
        }
        getCamera() {
            return this.camera;
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
        rotateX(point, angle) {
            return elements.Point3d.create(point.x, point.z * Math.cos(angle) - point.y * Math.sin(angle), point.z * Math.sin(angle) + point.y * Math.cos(angle));
        }
        rotateZ(point, angle) {
            return elements.Point3d.create(point.y * Math.sin(angle) + point.x * Math.cos(angle), point.y * Math.cos(angle) - point.x * Math.sin(angle), point.z);
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
    var Point = elements.Point;
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
        putBlock(position, color, size) {
            for (let o_x = 0; o_x < size; o_x++) {
                for (let o_y = 0; o_y < size; o_y++) {
                    this.putPixel(Point.create(position.x + o_x, position.y + o_y), color);
                }
            }
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
var charset;
(function (charset) {
    class Simple8x8 {
        constructor() {
            this.characters = [];
            this.init();
        }
        init() {
            this.characters = [];
            this.characters[32] = SPACE;
            this.characters[180] = UP;
            this.characters[172] = DOWN;
            this.characters[171] = LEFT;
            this.characters[187] = RIGHT;
        }
        height() {
            return 8;
        }
        width() {
            return 8;
        }
        get(char) {
            let index = char.charCodeAt(char.length - 1);
            return this.characters[index];
        }
    }
    charset.Simple8x8 = Simple8x8;
    const SPACE = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const UP = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 1, 1, 0, 1, 1],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const DOWN = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [1, 1, 0, 1, 1, 0, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const LEFT = [
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0]
    ];
    const RIGHT = [
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0]
    ];
})(charset || (charset = {}));
/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./charset/simple8x8.ts" />
var Demo;
(function (Demo) {
    var Point = elements.Point;
    class Drawing {
        // TODO create vector/line class which contains the basic calculations for the given object type (length, multiplication, add, unit, etc)
        static char(buffer, position, color, char, charset) {
            let c = charset.get(char);
            if (c == null)
                return;
            for (let x = 0; x < charset.width(); x++) {
                for (let y = 0; y < charset.height(); y++) {
                    let v = c[x][y];
                    if (v != null && v !== 0) {
                        buffer.putPixel(position.clone().add(Point.create(x, y)), color);
                    }
                }
            }
        }
        static rect(buffer, topLeft, bottomRight, color) {
            const topRight = Point.create(bottomRight.x, topLeft.y);
            const bottomLeft = Point.create(topLeft.x, bottomRight.y);
            Drawing.line(buffer, topLeft, topRight, color);
            Drawing.line(buffer, topRight, bottomRight, color);
            Drawing.line(buffer, bottomRight, bottomLeft, color);
            Drawing.line(buffer, bottomLeft, topLeft, color);
        }
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
var Engine;
(function (Engine) {
    var Point = elements.Point;
    class HeightMap {
        constructor(size) {
            this.heights = [];
            for (let y = 0; y < size; y++) {
                this.heights[y] = [];
                for (let x = 0; x < size; x++) {
                    this.heights[y][x] = null;
                }
            }
        }
        get width() {
            return this.heights.length;
        }
        get height() {
            return this.heights.length;
        }
        isValid(position) {
            if (position.x < 0 || position.x >= this.heights.length) {
                return false;
            }
            if (position.y < 0 || position.y >= this.heights.length) {
                return false;
            }
            return true;
        }
        set(position, height) {
            if (!this.isValid(position)) {
                return;
            }
            this.heights[position.y][position.x] = height;
        }
        setIfEmpty(position, height) {
            if (!this.isValid(position)) {
                return;
            }
            if (this.heights[position.y][position.x] === null) {
                this.heights[position.y][position.x] = height;
            }
        }
        get(position) {
            if (!this.isValid(position)) {
                return null;
            }
            return this.heights[position.y][position.x];
        }
    }
    Engine.HeightMap = HeightMap;
    class DepthAverage {
        constructor() {
            this.depths = [];
        }
        add(depth) {
            this.depths.push(depth);
        }
        average() {
            let values = this.depths.filter((current) => {
                return (current !== null);
            });
            let sum = values.reduce((prev, current) => {
                return prev + current;
            }, 0);
            return Math.round(sum / values.length);
        }
    }
    class Rectangle {
        constructor(topLeft, bottomRight) {
            this._topLeft = topLeft;
            this._bottomRight = bottomRight;
        }
        clone() {
            return new Rectangle(Point.create(this.topLeft.x, this.topLeft.y), Point.create(this.bottomRight.x, this.bottomRight.y));
        }
        add(offset) {
            this._topLeft.x += offset.x;
            this._topLeft.y += offset.y;
            this._bottomRight.x += offset.x;
            this._bottomRight.y += offset.y;
            return this;
        }
        get topLeft() {
            return this._topLeft;
        }
        get bottomRight() {
            return this._bottomRight;
        }
        // TODO topRight();
        // TODO bottomLeft();
        get center() {
            return Point.create(this._topLeft.x + Math.floor(this.width / 2), this._topLeft.y + Math.floor(this.height / 2));
        }
        get width() {
            return Math.abs(this._bottomRight.x - this._topLeft.x) + 1;
        }
        get height() {
            return Math.abs(this._bottomRight.y - this._topLeft.y) + 1;
        }
    }
    /**
     * Generate terrain using 'Diamond & square algorithm'
     *
     * @see https://en.wikipedia.org/wiki/Diamond-square_algorithm
     */
    class TerrainGenerator {
        constructor(size, depth) {
            this.depth = depth;
            this.roughness = 1;
            this.depthRandomRange = 15;
            let s = Math.pow(2, size) + 1;
            this.width = s;
            this.height = s;
            this._map = new HeightMap(s);
        }
        get map() {
            return this._map;
        }
        generate() {
            this.init();
            let area = new Rectangle(Point.create(0, 0), Point.create(this.width - 1, this.height - 1));
            if (!this.diamond(area)) {
                return;
            }
            this.iterate(area);
        }
        init() {
            let p1 = Point.create(0, 0);
            let p2 = Point.create(0, this.height - 1);
            let p3 = Point.create(this.width - 1, 0);
            let p4 = Point.create(this.width - 1, this.height - 1);
            this._map.setIfEmpty(p1, this.randomDepth());
            this._map.setIfEmpty(p2, this.randomDepth());
            this._map.setIfEmpty(p3, this.randomDepth());
            this._map.setIfEmpty(p4, this.randomDepth());
        }
        getCornerDepthsSquare(area) {
            let depths = new DepthAverage();
            let corners = [];
            corners.push(area.topLeft);
            corners.push(Point.create(area.bottomRight.x, area.topLeft.y));
            corners.push(area.bottomRight);
            corners.push(Point.create(area.topLeft.x, area.bottomRight.y));
            for (let i = 0; i < 4; i++) {
                depths.add(this._map.get(corners[i]));
            }
            return depths;
        }
        getCornerDepthsDiamond(area) {
            let depths = new DepthAverage();
            let corners = [];
            let halfWidth = Math.floor(area.width / 2);
            let halfHeight = Math.floor(area.height / 2);
            corners.push(area.topLeft.clone().add(Point.create(halfWidth, 0)));
            corners.push(area.topLeft.clone().add(Point.create(0, halfHeight)));
            corners.push(area.bottomRight.clone().add(Point.create(-halfWidth, 0)));
            corners.push(area.bottomRight.clone().add(Point.create(0, -halfHeight)));
            for (let i = 0; i < 4; i++) {
                depths.add(this._map.get(corners[i]));
            }
            return depths;
        }
        random() {
            return Math.round(Math.random() * this.depthRandomRange);
        }
        randomDepth() {
            return Math.round(Math.random() * this.depth);
        }
        iterate(area) {
            // Process the 4 square
            let square1 = area.clone().add(Point.create(0, -Math.floor(area.height / 2)));
            let square2 = area.clone().add(Point.create(0, +Math.floor(area.height / 2)));
            let square3 = area.clone().add(Point.create(-Math.floor(area.width / 2), 0));
            let square4 = area.clone().add(Point.create(+Math.floor(area.width / 2), 0));
            [square1, square2, square3, square4].forEach((area) => {
                this.square(area);
            });
            // Process sub-areas
            if (area.width < 5 || area.height < 5) {
                // No more space left
                return;
            }
            let halfWidth = Math.floor(area.width / 2);
            let halfHeight = Math.floor(area.height / 2);
            let diamond1 = new Rectangle(area.topLeft, Point.create(area.topLeft.x + halfWidth, area.topLeft.y + halfHeight));
            let diamond2 = new Rectangle(Point.create(area.topLeft.x + halfWidth, area.topLeft.y), Point.create(area.bottomRight.x, area.topLeft.y + halfHeight));
            let diamond3 = new Rectangle(Point.create(area.topLeft.x, area.topLeft.y + halfHeight), Point.create(area.topLeft.x + halfWidth, area.bottomRight.y));
            let diamond4 = new Rectangle(Point.create(area.topLeft.x + halfWidth, area.topLeft.y + halfHeight), area.bottomRight);
            [diamond1, diamond2, diamond3, diamond4].forEach((area) => {
                this.diamond(area);
            });
            [diamond1, diamond2, diamond3, diamond4].forEach((area) => {
                this.iterate(area);
            });
        }
        diamond(area) {
            if (area.width < 3 || area.height < 3) {
                // area reduced to 1 pixel
                return false;
            }
            let depths = this.getCornerDepthsSquare(area);
            let depthValue = depths.average() + this.depthNoise();
            this._map.setIfEmpty(area.center, depthValue);
            return true;
        }
        square(area) {
            if (area.width < 3 || area.height < 3) {
                // area reduced to 1 pixel
                return false;
            }
            let depths = this.getCornerDepthsDiamond(area);
            let depthValue = depths.average() + this.depthNoise();
            this._map.setIfEmpty(area.center, depthValue);
            return true;
        }
        depthNoise() {
            let noise = this.random() * Math.pow(2, -this.roughness);
            if (noise == 0) {
                return 1;
            }
            else {
                return noise;
            }
        }
    }
    Engine.TerrainGenerator = TerrainGenerator;
})(Engine || (Engine = {}));
var gui;
(function (gui) {
    var Point = elements.Point;
    var Color = elements.Color;
    var Drawing = Demo.Drawing;
    var Simple8x8 = charset.Simple8x8;
    class Hud {
        constructor(buffer) {
            this.dimensions = new Point(16, 16);
            this.buffer = buffer;
            this.borderColor = Color.create(255, 255, 255);
            this.charset = new Simple8x8();
        }
        draw() {
            this.drawButton(Point.create(0, 10), '«');
            this.drawButton(Point.create(18, 10), '»');
            this.drawButton(Point.create(36, 10), '┴');
            this.drawButton(Point.create(54, 10), '┬');
        }
        drawButton(offset, char) {
            let topLeft = offset;
            let bottomRight = offset.clone().add(this.dimensions);
            let c_w_center = Math.round(this.charset.width().valueOf() / 2);
            let c_h_center = Math.round(this.charset.height().valueOf() / 2);
            let c_x = topLeft.x + c_w_center;
            let c_y = topLeft.y + c_h_center;
            Drawing.rect(this.buffer, topLeft, bottomRight, this.borderColor);
            Drawing.char(this.buffer, Point.create(c_x, c_y), this.borderColor, char, this.charset);
        }
    }
    gui.Hud = Hud;
})(gui || (gui = {}));
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
/// <reference path="./Engine/TerrainGenerator.ts" />
/// <reference path="./Demo/gui/Hud.ts" />
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
var TerrainGenerator = Engine.TerrainGenerator;
var HeightMap = Engine.HeightMap;
var Hud = gui.Hud;
class Main {
    constructor(screen) {
        this.screen = screen;
        let camera = Point3d.create(50, 220, 400);
        let cameraOrientation = Point3d.create(75, -25, 0);
        let surface = Point3d.create(25, 100, 400);
        this.scene = new Scene(camera, cameraOrientation, surface);
        this.angle = 0;
    }
    registerKeyboard(left, right, up, down) {
        console.log('+', 'registering keyboard events');
        window.addEventListener('keydown', (e) => {
            console.log(e.code, e.type, e.key);
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (left)
                        left();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (right)
                        right();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (up)
                        up();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (down)
                        down();
                    break;
            }
        });
    }
    runTest() {
        this.buffer = new ScreenBuffer(document, Point.create(this.screen.getWidth(), this.screen.getHeight()));
        this.hud = new gui.Hud(this.buffer);
        this.buffer.paint(this.screen.context());
        this.hud.draw();
        let terrain = this.terrainInit();
        this.drawPoints(terrain);
        this.registerKeyboard(() => {
            this.scene.getCamera().addX(2);
            this.drawPoints(terrain);
            this.hud.draw();
        }, () => {
            this.scene.getCamera().addX(-2);
            this.drawPoints(terrain);
            this.hud.draw();
        }, () => {
            this.scene.getCamera().addZ(-2);
            this.drawPoints(terrain);
            this.hud.draw();
        }, () => {
            this.scene.getCamera().addZ(2);
            this.drawPoints(terrain);
            this.hud.draw();
        });
    }
    terrainInit() {
        const generator = new TerrainGenerator(7, 128);
        generator.generate();
        return this.terrain3D(generator.map);
    }
    rotatePoints(points, angleY) {
        let rotated = [];
        const t = new elements.Transformer();
        for (let x = 0; x < points.length; x++) {
            let rotatedPoint = t.rotateY(points[x], t.degreeToRad(angleY));
            rotated.push(rotatedPoint);
        }
        return rotated;
    }
    terrain3D(heightMap) {
        let points = [];
        let y1 = 0, x1 = 0;
        let bs = 3;
        for (let y = 0; y < heightMap.height; y++) {
            x1 = 0;
            for (let x = 0; x < heightMap.width; x++) {
                let height = heightMap.get(Point.create(x, y));
                let p = new Point3d(x1, height, y1);
                x1 += bs;
                points.push(p);
            }
            y1 += bs;
        }
        return points;
    }
    drawPoints(points) {
        const t = new elements.Transformer();
        const w = this.screen.getWidth();
        const h = this.screen.getHeight();
        const screenOffset = new Point(w / 2 + 250, h / 2 - 25);
        const buffer = this.buffer;
        let bs = 3;
        buffer.clear();
        for (let x = 0; x < points.length; x++) {
            const p = points[x];
            let p1 = t.perspectiveTransformTo2D(p, this.scene).add(screenOffset);
            let color = new Color(p.y, p.y, p.y);
            buffer.putBlock(p1.rounded(), color, bs * 2);
        }
        this.screen.clear();
        buffer.paint(this.screen.context());
    }
    drawHeightMap(heightMap) {
        const buffer = this.buffer;
        let bs = 4;
        let y1 = 0, x1 = 0;
        for (let y = 0; y < heightMap.height; y++) {
            x1 = 0;
            for (let x = 0; x < heightMap.width; x++) {
                let height = heightMap.get(Point.create(x, y));
                let color = new Color(height, height, height);
                // buffer.putPixel(Point.create(x1, y1), color);
                buffer.putBlock(Point.create(x1, y1), color, bs);
                x1 += bs;
            }
            y1 += bs;
        }
        buffer.paint(this.screen.context());
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
