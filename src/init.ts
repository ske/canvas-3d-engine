/// <reference path="./Demo/Screen.ts" />
/// <reference path="./Main.ts" />

type StringOrNumber = string | number;
type StylePropertyMap = { [key: string]: StringOrNumber };
type StyleMap = { [key: string]: StylePropertyMap };

const styles: StyleMap = {
  html: {
    "background-color": "#444",
    color: "#eee",
  },
  body: {
    margin: "0px",
    padding: "0px",
  },
  canvas: {
    "background-color": "black",
    display: "flex",
    margin: "0 auto",
  },
};

function style(e: HTMLElement): void {
  let css: StylePropertyMap = styles[e.tagName.toLowerCase()];
  if (css) {
    for (let k of Object.keys(css)) {
      let v: string = css[k] as string;
      e.style.setProperty(k, v);
    }
  }
}

function init(): void {
  const html: HTMLElement = document.querySelector("html")!;
  style(html);

  const body: HTMLBodyElement = html.querySelector("body")!;
  style(body);

  const canvas: HTMLCanvasElement = document.createElement("canvas")!;
  style(canvas);

  canvas.width = 1280;
  canvas.height = 720;

  body.append(canvas);

  const screen = new Demo.Screen(canvas);
  const main = new Main(screen);

  main.runTest();
}
