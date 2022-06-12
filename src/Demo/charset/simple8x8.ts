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
        private characters:CharacterSet = [];

        constructor() {
            this.init();
        }

        init() {
            this.characters = [];
            this.characters[32] = SPACE;
            this.characters[180] = UP;
            this.characters[172] = DOWN;
            this.characters[171] = LEFT;
            this.characters[187] = RIGHT;
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

    const SPACE:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ];

    const UP:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    const DOWN:MatrixOrNull = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [1,1,0,1,1,0,1,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    const LEFT:MatrixOrNull = [
        [0,0,0,0,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,1,0,0,0]
    ];
    const RIGHT:MatrixOrNull = [
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