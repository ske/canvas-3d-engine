namespace elements {
  export class Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number | undefined;

    constructor(r: number, g: number, b: number, a?: number) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }

    static create(r: number, g: number, b: number, a?: number): Color {
      return new Color(r, g, b, a);
    }
  }
}
