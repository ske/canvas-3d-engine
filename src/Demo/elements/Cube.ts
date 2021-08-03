/// <reference path="./Point3d.ts" />
/// <reference path="./Pair.ts" />

namespace elements {
    export class Cube {
        private points: Point3d[];
        private lines: Pair[];
        private size: number;
    
        clone(): Cube {
            let clone = new Cube(this.size);

            for (let i=0; i<this.points.length; i++) {
                this.points[i].copyTo(clone.getPointByIndex(i+1));
            }

            return clone;
        }
    
        constructor(size: number) {
            this.size = size;
    
            const p1 = new Point3d(-1,-1,-1);
            const p2 = new Point3d(1,-1,-1);
            const p3 = new Point3d(1,1,-1);
            const p4 = new Point3d(-1,1,-1);
    
            const p5 = new Point3d(-1,-1,1);
            const p6 = new Point3d(1,-1,1);
            const p7 = new Point3d(1,1,1);
            const p8 = new Point3d(-1,1,1);
    
            const l1 = new Pair(1, 2);
            const l2 = new Pair(2, 3);
            const l3 = new Pair(3, 4);
            const l4 = new Pair(4, 1);
    
            const l5 = new Pair(5, 6);
            const l6 = new Pair(6, 7);
            const l7 = new Pair(7, 8);
            const l8 = new Pair(8, 5);
    
            const l9 = new Pair(1, 5);
            const l10 = new Pair(2, 6);
            const l11 = new Pair(3, 7);
            const l12 = new Pair(4, 8);
    
            this.lines = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12];
            this.points = [p1, p2, p3, p4, p5, p6, p7, p8];
    
            this.points.forEach((p) => {
                p.x=p.x * size;
                p.y=p.y * size;
                p.z=p.z * size;
            });
        }
    
        getPoints(): Point3d[] {
            return this.points;
        }
    
        getLines(): Pair[] {
            return this.lines;
        }
    
        getPointByIndex(i: number): Point3d {
            return this.points[i-1];
        }
    }
    
}