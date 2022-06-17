namespace gui {

    import Point = elements.Point;
    import Color = elements.Color;
    import Drawing = Demo.Drawing;
    import ScreenBuffer = Demo.ScreenBuffer;
    import CharSet = charset.CharSet;
    import Simple8x8 = charset.Simple8x8;

    export class Hud {
        static LEFT = '«';
        static RIGHT = '»';
        static UP = '┴';
        static DOWN = '┬';

        dimensions:Point;
        borderColor:Color;
        backgroundColor: Color;
        buffer:ScreenBuffer;
        charset: CharSet;
        screen: Demo.Screen;

        constructor(buffer:ScreenBuffer, screen: Demo.Screen) {
            this.dimensions = new Point(16,16);
            this.buffer = buffer;
            this.borderColor = Color.create(255,255,255);
            this.backgroundColor = Color.create(0,0,0);
            this.charset = new Simple8x8();
            this.screen = screen;
        }

        draw(highlighted: boolean = false, key: string = ''): void {
            if (key.length) {
                this.drawButton(Point.create(0,10), Hud.LEFT, key == Hud.LEFT ? highlighted : false);
                this.drawButton(Point.create(18,10), Hud.RIGHT, key == Hud.RIGHT ? highlighted : false);
                this.drawButton(Point.create(36,10), Hud.UP, key == Hud.UP ? highlighted : false);
                this.drawButton(Point.create(54,10), Hud.DOWN, key == Hud.DOWN ? highlighted : false);
            } else {
                this.drawButton(Point.create(0,10), Hud.LEFT, false);
                this.drawButton(Point.create(18,10), Hud.RIGHT, false);
                this.drawButton(Point.create(36,10), Hud.UP, false);
                this.drawButton(Point.create(54,10), Hud.DOWN, false);
            }

            this.buffer.paint(this.screen.context());
        }

        drawButton(offset: Point, char: string, highlighted: boolean = false): void {
            let topLeft:Point = offset;
            let bottomRight:Point = offset.clone().add(this.dimensions);

            let c_w_center = Math.round(this.charset.width().valueOf() / 2);
            let c_h_center = Math.round(this.charset.height().valueOf() / 2);

            let c_x = topLeft.x + c_w_center;
            let c_y = topLeft.y + c_h_center;

            if (highlighted) {
                Drawing.filledRect(this.buffer, topLeft, bottomRight, this.borderColor);
                Drawing.char(this.buffer, Point.create(c_x, c_y), this.backgroundColor, char, this.charset);
            } else {
                Drawing.filledRect(this.buffer, topLeft, bottomRight, this.backgroundColor);
                Drawing.rect(this.buffer, topLeft, bottomRight, this.borderColor);
                Drawing.char(this.buffer, Point.create(c_x, c_y), this.borderColor, char, this.charset);
            }
        }
    }
}