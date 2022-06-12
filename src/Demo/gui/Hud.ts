namespace gui {

    import Point = elements.Point;
    import Color = elements.Color;
    import Drawing = Demo.Drawing;
    import ScreenBuffer = Demo.ScreenBuffer;
    import CharSet = charset.CharSet;
    import Simple8x8 = charset.Simple8x8;

    export class Hud {
        private dimensions:Point;
        private borderColor:Color;
        private buffer:ScreenBuffer;
        private charset: CharSet;

        constructor(buffer:ScreenBuffer) {
            this.dimensions = new Point(16,16);
            this.buffer = buffer;
            this.borderColor = Color.create(255,255,255);
            this.charset = new Simple8x8();
        }

        draw(): void {
            this.drawButton(Point.create(0,10), '«');
            this.drawButton(Point.create(18,10), '»');
            this.drawButton(Point.create(36,10), '┴');
            this.drawButton(Point.create(54,10), '┬');
        }

        drawButton(offset: Point, char: string): void {
            let topLeft:Point = offset;
            let bottomRight:Point = offset.clone().add(this.dimensions);

            let c_w_center = Math.round(this.charset.width().valueOf() / 2);
            let c_h_center = Math.round(this.charset.height().valueOf() / 2);

            let c_x = topLeft.x + c_w_center;
            let c_y = topLeft.y + c_h_center;

            Drawing.rect(this.buffer, topLeft, bottomRight, this.borderColor);
            Drawing.char(this.buffer, Point.create(c_x, c_y), this.borderColor, char, this.charset);
        }
    }
}