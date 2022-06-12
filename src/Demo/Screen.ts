namespace Demo {
  export class Screen {
    private ref: HTMLCanvasElement;
    private readonly width: number;
    private readonly height: number;
    private readonly contextRef: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
      this.ref = canvas;
      this.width = canvas.width;
      this.height = canvas.height;

      this.contextRef = canvas.getContext("2d")!;
    }

    clear(): void {
      this.contextRef.clearRect(0,0, this.getWidth(), this.getHeight());
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
