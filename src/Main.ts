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

import Point = elements.Point;
import Point3d = elements.Point3d;
import Color = elements.Color;
import Cube = elements.Cube;
import Scene = elements.Scene;
import ScreenBuffer = Demo.ScreenBuffer;
import Drawing = Demo.Drawing;
import Profiler = util.Profiler;
import PrintEvents = util.PrintEvents;
import GetElapsedTime = util.GetElapsedTime;
import TerrainGenerator = Engine.TerrainGenerator;
import HeightMap = Engine.HeightMap;

class Main {
    private screen: Demo.Screen;
    private scene: Scene;
    private buffer: ScreenBuffer | undefined;

    constructor(screen: Demo.Screen) {
        this.screen = screen;

        let camera = Point3d.create(50, 220, 400);
        let cameraOrientation = Point3d.create(75, -25, 0);
        let surface = Point3d.create(25, 100, 400);

        this.scene = new Scene(camera, cameraOrientation, surface);
    }

    runTest(): void {
        this.buffer = new ScreenBuffer(
            document,
            Point.create(this.screen.getWidth(), this.screen.getHeight())
        );

        this.terrainTest();

        // const cube = new Cube(90);
        // this.cubeRotationTest(cube, 0);

        // this.pixelTest();
    }

    private terrainTest(): void {
        const generator = new TerrainGenerator(7, 128);
        generator.generate();

        // this.drawHeightMap(generator.map);
        this.terrain3D(generator.map);
    }

    private terrain3D(heightMap: HeightMap): void {
      const t = new elements.Transformer();
      const w = this.screen.getWidth();
      const h = this.screen.getHeight();
      const screenOffset = new Point(w / 2 + 250, h / 2 - 25);

      const buffer = this.buffer!;

      let bs: number = 3;
      let y1 = 0, x1 = 0;
      let prev:Point|null = null;

      for (let y = 0; y < heightMap.height; y++) {
        x1 = 0;
        for (let x = 0; x < heightMap.width; x++) {
          let height: number = heightMap.get(Point.create(x,y))!;
          let color = new Color(height, height, height);

          let p = new Point3d(x1,height,y1);
          let p1 = t.perspectiveTransformTo2D(p, this.scene).add(screenOffset);

          if (prev !== null) {
            //this.line(prev, p1, color);
          }

          buffer.putBlock(p1.rounded(), color, bs*2);

          prev = p1;
          x1 += bs;
        }
        prev = null;
        y1 += bs;
      }

      buffer.paint(this.screen.context());
    }

    private drawHeightMap(heightMap: HeightMap): void {
        const buffer = this.buffer!;

        let bs: number = 4;
        let y1 = 0, x1 = 0;
        for (let y = 0; y < heightMap.height; y++) {
            x1 = 0;
            for (let x = 0; x < heightMap.width; x++) {
                let height: number = heightMap.get(Point.create(x,y))!;
                let color = new Color(height, height, height);

                // buffer.putPixel(Point.create(x1, y1), color);
                buffer.putBlock(Point.create(x1, y1), color, bs);
                x1 += bs;
            }
            y1 += bs;
        }

        buffer.paint(this.screen.context());
    }

    private pixelTest(): void {
        const buffer = this.buffer!;
        const color = new Color(255, 255, 255);

        buffer.putPixel(Point.create(10, 10), color);

        Drawing.line(
            buffer,
            Point.create(200, 250),
            Point.create(-100, -50),
            color
        );
        buffer.paint(this.screen.context());
    }

    private cubeRotationTest(cube: Cube, angle: number): void {
        Profiler.instance().start("CR");

        const t = new elements.Transformer();
        const w = this.screen.getWidth();
        const h = this.screen.getHeight();
        const screenOffset = new Point(w / 2 - 25, h / 2 - 25);

        Profiler.instance().snapshot("CR", "init");

        const buffer = this.buffer!;
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
            .fillText(Math.round(GetElapsedTime(timers!)).toString(), 10, 10);

        if (angle < 20) {
            PrintEvents(timers!);
        }

        const _this = this;
        setTimeout(() => {
            _this.cubeRotationTest(cube, angle);
        }, 50);
    }

    private line(p1: Point, p2: Point, color: Color): void {
        if (!this.buffer) return;

        Demo.Drawing.line(this.buffer, p1, p2, color);
    }

    private drawCanvasLine(from: Point, to: Point, color: Color): void {
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
    private moveCube(cube: Cube, vector: Point3d): Cube {
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
    private rotateCube(cube: Cube, angle: number): Cube {
        const t = new elements.Transformer();

        const rotated = cube.clone();

        rotated.getPoints().forEach((point) => {
            const rotatedPoint = t.rotateY(point, angle);
            rotatedPoint.copyTo(point);
        });

        return rotated;
    }

    private drawAxes(screenOffset: Point): void {
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
    line3d(a: Point3d, b: Point3d, color: Color, screenOffset: Point): void {
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
    private drawCube(cube: Cube, screenOffset: Point): void {
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
