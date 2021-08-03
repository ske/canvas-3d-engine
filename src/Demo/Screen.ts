namespace Demo {
    export class Screen {
        private ref: HTMLCanvasElement;
        private width: number;
        private height: number;
        private contextRef: CanvasRenderingContext2D;

        constructor(canvas: HTMLCanvasElement) {
            this.ref = canvas;
            this.width = canvas.width;
            this.height = canvas.height;

            this.contextRef = canvas.getContext("2d")!;
        }

        context(): CanvasRenderingContext2D {
            return this.contextRef;
        }

        getWidth(): number {
            return this.width;
        }

        getHeight(): number {
            return this.height;
        }
    }
}