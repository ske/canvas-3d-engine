namespace charset {

    export type numberOrNull = number | null;
    export type Matrix = numberOrNull[][];
    export type MatrixOrNull = Matrix | null;
    export type CharacterSet = MatrixOrNull[];

    export interface CharSet {
        get(char: string): MatrixOrNull;
        width():Number;
        height():Number;
    }

    export class Simple8x8 implements CharSet {
        static KEYCODE_SPACE = 32;

        static KEYCODE_LEFT = 180;
        static KEYCODE_RIGHT = 172;
        static KEYCODE_UP = 171;
        static KEYCODE_DOWN = 187;

        private characters:CharacterSet = [];

        constructor() {
            this.init();
        }

        init() {
            this.characters = [];

            this.characters[Simple8x8.KEYCODE_SPACE] = CHAR_SPACE;

            this.characters[Simple8x8.KEYCODE_LEFT] = CHAR_LEFT;
            this.characters[Simple8x8.KEYCODE_RIGHT] = CHAR_RIGHT;
            this.characters[Simple8x8.KEYCODE_UP] = CHAR_UP;
            this.characters[Simple8x8.KEYCODE_DOWN] = CHAR_DOWN;
        }

        height(): Number {
            return 8;
        }

        width(): Number {
            return 8;
        }

        public get(char: string): MatrixOrNull {
            let index:number = char.charCodeAt(char.length - 1);
            return this.characters[index];
        }
    }

    const CHAR_SPACE:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ];

    const CHAR_UP:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    const CHAR_DOWN:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [1,1,0,1,1,0,1,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    const CHAR_LEFT:MatrixOrNull = [
        [0,0,0,0,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,1,0,0,0]
    ];
    const CHAR_RIGHT:MatrixOrNull = [
        [0,0,0,1,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,0,0]
    ];
}