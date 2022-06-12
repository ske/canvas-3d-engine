namespace elements {
  export type Points = Point3d[];

  export class Point3d {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    addX(value:number):void {
      this.x+=value;
    }

    addY(value:number):void {
      this.y+=value;
    }

    addZ(value:number):void {
      this.z+=value;
    }

    clone(): Point3d {
      return new Point3d(this.x, this.y, this.z);
    }

    static create(x: number, y: number, z: number): Point3d {
      return new Point3d(x, y, z);
    }

    copyTo(point: Point3d): void {
      point.x = this.x;
      point.y = this.y;
      point.z = this.z;
    }

    add(point: Point3d): void {
      this.x += point.x;
      this.y += point.y;
      this.z += point.z;
    }
  }
}
