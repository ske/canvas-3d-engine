/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
namespace Demo {
  import Color = elements.Color;
  import Point = elements.Point;

  export class ScreenBuffer {
    private readonly canvas: HTMLCanvasElement;
    private readonly width: number;
    private readonly height: number;
    private image: ImageData | undefined;

    /**
     * FIXME create class for dimension with prop w/h instead of using Point
     */
    constructor(
      document: HTMLDocument,
      dimensions: Point,
      clear: boolean = true
    ) {
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

    private getContext(): CanvasRenderingContext2D {
      return this.canvas.getContext("2d")!;
    }

    private validPosition(position: Point): boolean {
      if (!this.image) return false;

      if (position.x < 0 || position.y < 0) return false;
      if (position.x > this.width - 1 || position.y > this.height - 1)
        return false;

      return true;
    }

    putPixel(position: Point, color: Color): void {
      if (!this.validPosition(position)) return;

      let offset = (position.x + position.y * this.width) * 4;

      this.image!.data[offset] = color.r;
      this.image!.data[offset + 1] = color.g;
      this.image!.data[offset + 2] = color.b;

      if (color.a) {
        this.image!.data[offset + 3] = color.a;
      } else {
        this.image!.data[offset + 3] = 255;
      }
    }

    getPixel(position: Point): Color | undefined {
      if (!this.validPosition(position)) return;

      let offset = (position.x + position.y * this.width) * 4;

      return Color.create(
        this.image!.data[offset],
        this.image!.data[offset + 1],
        this.image!.data[offset + 2],
        this.image!.data[offset + 3]
      );
    }

    paint(buffer: CanvasRenderingContext2D): void {
      if (this.image) {
        this.getContext().putImageData(this.image, 0, 0);
        buffer.drawImage(this.canvas, 0, 0);
      }
    }

    clear(): void {
      this.image!.data.fill(0);
    }

    private create(): void {
      this.image = this.getContext().getImageData(
        0,
        0,
        this.width,
        this.height
      );
    }
  }
}
