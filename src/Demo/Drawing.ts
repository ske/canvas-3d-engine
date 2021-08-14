/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
/// <reference path="./ScreenBuffer.ts" />

namespace Demo {
  import Point = elements.Point;
  import Color = elements.Color;

  export class Drawing {
    // TODO create vector/line class which contains the basic calculations for the given object type (length, multiplication, add, unit, etc)

    static line(
      buffer: ScreenBuffer,
      p1: Point,
      p2: Point,
      color: Color
    ): void {
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
}
