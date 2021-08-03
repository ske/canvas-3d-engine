namespace elements {
    export class Point {
        x: number;
        y: number;
        constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }
        static create(x:number, y:number): Point {
            return new Point(x, y);
        }
        add(p:Point): Point {
            this.x+=p.x;
            this.y+=p.y;
    
            return this;
        }
        sub(p:Point): Point {
            this.x-=p.x;
            this.y-=p.y;
    
            return this;
        }
    }
}