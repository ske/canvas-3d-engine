namespace elements {
    export class Point3d {
        x: number;
        y: number;
        z: number;
        constructor(x:number, y:number, z:number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        static create(x:number, y:number, z:number): Point3d {
            return new Point3d(x, y, z);
        }

        copyTo(point:Point3d): void {
            point.x = this.x;
            point.y = this.y;
            point.z = this.z;
        }

        add(point:Point3d): void {
            this.x+=point.x;
            this.y+=point.y;
            this.z+=point.z;
        }
    }    
}