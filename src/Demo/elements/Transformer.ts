/// <reference path="./Point3d.ts" />
/// <reference path="./Point.ts" />
/// <reference path="./Scene.ts" />
namespace elements {
  export class Transformer {
    constructor() {}

    rotateY(point: Point3d, angle: number): Point3d {
      return Point3d.create(
        point.z * Math.sin(angle) + point.x * Math.cos(angle),
        point.y,
        point.z * Math.cos(angle) - point.x * Math.sin(angle)
      );
    }

    degreeToRad(degree: number): number {
      const degree360 = 2 * Math.PI;
      return (degree / 360) * degree360;
    }

    perspectiveTransformTo2D(point: Point3d, scene: Scene): Point {
      // when camera = (0,0,0) and cameraOrientation = (0,0,0) the transform is exactly as transform2D

      let x = point.x - scene.camera.x;
      let y = point.y - scene.camera.y;
      let z = point.z - scene.camera.z;

      let c = Point3d.create(
        Math.cos(scene.cameraOrientation.x),
        Math.cos(scene.cameraOrientation.y),
        Math.cos(scene.cameraOrientation.z)
      );

      let s = Point3d.create(
        Math.sin(scene.cameraOrientation.x),
        Math.sin(scene.cameraOrientation.y),
        Math.sin(scene.cameraOrientation.z)
      );

      let d = Point3d.create(
        c.y * (s.z * y + c.z * x) - s.y * z,
        s.x * (c.y * z + s.y * (s.z * y + c.z * x)) + c.x * (c.z * y - s.z * x),
        c.x * (c.y * z + s.y * (s.z * y + c.z * x)) - s.x * (c.z * y - s.z * x)
      );

      let transformedX = (scene.surface.z / d.z) * d.x + scene.surface.x;
      let transformedY = (scene.surface.z / d.z) * d.y + scene.surface.y;

      return Point.create(transformedX, transformedY);
    }
  }
}
