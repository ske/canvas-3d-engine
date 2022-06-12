/// <reference path="./Point3d.ts" />
namespace elements {
  export class Scene {
    camera: Point3d;
    cameraOrientation: Point3d;
    surface: Point3d;

    constructor(camera: Point3d, cameraOrientation: Point3d, surface: Point3d) {
      this.camera = camera;
      this.cameraOrientation = cameraOrientation;
      this.surface = surface;
    }

    getCameraOrientation(): Point3d {
      return this.cameraOrientation;
    }

    getCamera(): Point3d {
      return this.camera;
    }
  }
}
