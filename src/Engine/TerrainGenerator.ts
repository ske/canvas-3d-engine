namespace Engine {

    import Point = elements.Point;

    type numberOrNull = number | null;
    type Matrix = numberOrNull[][];

    export class HeightMap {
        private readonly heights: Matrix;

        get width(): number {
            return this.heights.length;
        }

        get height(): number {
            return this.heights.length;
        }

        constructor(size: number) {
            this.heights = [];

            for (let y = 0; y < size; y++) {
                this.heights[y] = [];
                for (let x = 0; x < size; x++) {
                    this.heights[y][x] = null;
                }
            }
        }

        private isValid(position: Point): boolean
        {
            if (position.x < 0 || position.x >= this.heights.length) {
                return false;
            }

            if (position.y < 0 || position.y >= this.heights.length) {
                return false;
            }

            return true;
        }

        set(position:Point, height: number): void {
            if (!this.isValid(position)) {
                return;
            }

            this.heights[position.y][position.x] = height;
        }

        setIfEmpty(position:Point, height: number): void {
            if (!this.isValid(position)) {
                return;
            }

            if (this.heights[position.y][position.x] === null) {
                this.heights[position.y][position.x] = height;
            }
        }

        get(position:Point): numberOrNull {
            if (!this.isValid(position)) {
                return null;
            }

            return this.heights[position.y][position.x];
        }
    }

    class DepthAverage {
        private depths: numberOrNull[];

        constructor() {
            this.depths = [];
        }

        add(depth: numberOrNull) {
            this.depths.push(depth);
        }

        average(): number {
            let values: any[] = this.depths.filter((current) => {
                return (current !== null);
            })

            let sum: number = values.reduce((prev, current) => {
                return prev + current;
            }, 0)

            return Math.round(sum / values.length);
        }
    }

    class Rectangle {
        private readonly _topLeft: Point;
        private readonly _bottomRight: Point;

        constructor(topLeft: elements.Point, bottomRight: elements.Point) {
            this._topLeft = topLeft;
            this._bottomRight = bottomRight;
        }

        clone(): Rectangle {
            return new Rectangle(
                Point.create(this.topLeft.x, this.topLeft.y),
                Point.create(this.bottomRight.x, this.bottomRight.y)
            )
        }

        add(offset: Point): Rectangle {
            this._topLeft.x += offset.x;
            this._topLeft.y += offset.y;

            this._bottomRight.x += offset.x;
            this._bottomRight.y += offset.y;

            return this;
        }

        get topLeft(): elements.Point {
            return this._topLeft;
        }

        get bottomRight(): elements.Point {
            return this._bottomRight;
        }

        // TODO topRight();
        // TODO bottomLeft();

        get center(): Point {
            return Point.create(
                this._topLeft.x + Math.floor(this.width / 2),
                this._topLeft.y + Math.floor(this.height / 2)
            );
        }

        get width(): number {
            return Math.abs(this._bottomRight.x - this._topLeft.x) + 1;
        }

        get height(): number {
            return Math.abs(this._bottomRight.y - this._topLeft.y) + 1;
        }
    }

    /**
     * Generate terrain using 'Diamond & square algorithm'
     *
     * @see https://en.wikipedia.org/wiki/Diamond-square_algorithm
     */
    export class TerrainGenerator {
        private readonly depth: number;
        private readonly roughness: number;
        private readonly depthRandomRange: number;
        private width:number;
        private height:number;
        private _map: HeightMap;

        get map(): HeightMap {
            return this._map;
        }

        constructor(size: number, depth: number) {
            this.depth = depth;
            this.roughness = 1;
            this.depthRandomRange = 15;

            let s = Math.pow(2, size) + 1;
            this.width = s;
            this.height = s;

            this._map = new HeightMap(s);
        }

        generate(): void {
            this.init();
            let area: Rectangle = new Rectangle(Point.create(0, 0), Point.create(this.width - 1, this.height - 1));

            if (!this.diamond(area)) {
                return;
            }

            this.iterate(area);
        }

        private init(): void {
            let p1: Point = Point.create(0, 0);
            let p2: Point = Point.create(0, this.height - 1);
            let p3: Point = Point.create(this.width - 1, 0);
            let p4: Point = Point.create(this.width - 1, this.height - 1);

            this._map.setIfEmpty(p1, this.randomDepth());
            this._map.setIfEmpty(p2, this.randomDepth());
            this._map.setIfEmpty(p3, this.randomDepth());
            this._map.setIfEmpty(p4, this.randomDepth());
        }

        private getCornerDepthsSquare(area: Rectangle): DepthAverage {
            let depths: DepthAverage = new DepthAverage();
            let corners: Point[] = [];

            corners.push(area.topLeft);
            corners.push(Point.create(area.bottomRight.x, area.topLeft.y));
            corners.push(area.bottomRight);
            corners.push(Point.create(area.topLeft.x, area.bottomRight.y));

            for (let i = 0; i < 4; i++) {
                depths.add(this._map.get(corners[i]));
            }

            return depths;
        }

        private getCornerDepthsDiamond(area: Rectangle): DepthAverage {
            let depths: DepthAverage = new DepthAverage();
            let corners: Point[] = [];

            let halfWidth: number = Math.floor(area.width / 2);
            let halfHeight: number = Math.floor(area.height / 2);

            corners.push(area.topLeft.clone().add(Point.create(halfWidth, 0)));
            corners.push(area.topLeft.clone().add(Point.create(0, halfHeight)));

            corners.push(area.bottomRight.clone().add(Point.create(-halfWidth, 0)));
            corners.push(area.bottomRight.clone().add(Point.create(0, -halfHeight)));

            for (let i = 0; i < 4; i++) {
                depths.add(this._map.get(corners[i]));
            }

            return depths;
        }

        private random(): number {
            return Math.round(Math.random() * this.depthRandomRange);
        }

        private randomDepth(): number {
            return Math.round(Math.random() * this.depth);
        }

        private iterate(area: Rectangle): void {
            // Process the 4 square
            let square1: Rectangle = area.clone().add(Point.create(0, -Math.floor(area.height / 2)));
            let square2: Rectangle = area.clone().add(Point.create(0, +Math.floor(area.height / 2)));
            let square3: Rectangle = area.clone().add(Point.create(-Math.floor(area.width / 2), 0));
            let square4: Rectangle = area.clone().add(Point.create(+Math.floor(area.width / 2), 0));

            [square1, square2, square3, square4].forEach((area: Rectangle) => {
                this.square(area);
            });

            // Process sub-areas
            if (area.width < 5 || area.height < 5) {
                // No more space left
                return;
            }

            let halfWidth = Math.floor(area.width / 2);
            let halfHeight = Math.floor(area.height / 2);

            let diamond1: Rectangle = new Rectangle(area.topLeft, Point.create(area.topLeft.x + halfWidth, area.topLeft.y + halfHeight));
            let diamond2: Rectangle = new Rectangle(Point.create(area.topLeft.x + halfWidth, area.topLeft.y), Point.create(area.bottomRight.x, area.topLeft.y + halfHeight));

            let diamond3: Rectangle = new Rectangle(Point.create(area.topLeft.x, area.topLeft.y + halfHeight), Point.create(area.topLeft.x + halfWidth, area.bottomRight.y));
            let diamond4: Rectangle = new Rectangle(Point.create(area.topLeft.x + halfWidth, area.topLeft.y + halfHeight), area.bottomRight);

            [diamond1, diamond2, diamond3, diamond4].forEach((area: Rectangle) => {
                this.diamond(area);
            });

            [diamond1, diamond2, diamond3, diamond4].forEach((area: Rectangle) => {
                this.iterate(area);
            });
        }

        private diamond(area: Rectangle): boolean {
            if (area.width < 3 || area.height < 3) {
                // area reduced to 1 pixel
                return false;
            }

            let depths = this.getCornerDepthsSquare(area);
            let depthValue = depths.average() + this.depthNoise();

            this._map.setIfEmpty(area.center, depthValue);

            return true;
        }

        private square(area: Rectangle): boolean {
            if (area.width < 3 || area.height < 3) {
                // area reduced to 1 pixel
                return false;
            }
            let depths = this.getCornerDepthsDiamond(area);
            let depthValue = depths.average() + this.depthNoise();

            this._map.setIfEmpty(area.center, depthValue);

            return true;
        }

        private depthNoise(): number {
            let noise = this.random() * Math.pow(2, -this.roughness);
            if (noise == 0) {
                return 1;
            } else {
                return noise;
            }
        }
    }
}