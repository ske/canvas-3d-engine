/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./elements/Point.ts" />
/// <reference path="./elements/Color.ts" />
/// <reference path="./ScreenBuffer.ts" />
/// <reference path="./charset/simple8x8.ts" />

namespace Demo {
  import Point = elements.Point;
  import Color = elements.Color;

  export class Drawing {
    // TODO create vector/line class which contains the basic calculations for the given object type (length, multiplication, add, unit, etc)

    static char(
        buffer: ScreenBuffer,
        position: Point,
        color: Color,
        char: string,
        charset: charset.CharSet
    ) {
      let c = charset.get(char);

      if (c == null) return;

      for (let x=0; x<charset.width(); x++) {
        for (let y=0; y<charset.height(); y++) {
          let v:charset.numberOrNull = c[x][y];
          if (v!=null && v !== 0) {
            buffer.putPixel(
                position.clone().add(Point.create(x,y)),
                color
            );

          }
        }
      }
    }

    static filledRect(buffer: ScreenBuffer,
                      topLeft: Point,
                      bottomRight: Point,
                      fillColor: Color): void {

      const topRight:Point = Point.create(bottomRight.x, topLeft.y);
      const bottomLeft:Point = Point.create(topLeft.x, bottomRight.y);

      for (let y:number = topLeft.y; y<bottomLeft.y; y++) {
        Drawing.line(
            buffer,
            Point.create(topLeft.x, y),
            Point.create(topRight.x, y),
            fillColor
        );
      }
    }

    static rect(
        buffer: ScreenBuffer,
        topLeft: Point,
        bottomRight: Point,
        color: Color
    ):void {
      const topRight:Point = Point.create(bottomRight.x, topLeft.y);
      const bottomLeft:Point = Point.create(topLeft.x, bottomRight.y);

      Drawing.line(buffer, topLeft, topRight, color);
      Drawing.line(buffer, topRight, bottomRight, color);
      Drawing.line(buffer, bottomRight, bottomLeft, color);
      Drawing.line(buffer, bottomLeft, topLeft, color);
    }

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
