const NBR_PIECES = 21;

let INDEX = 0;

export class Player {
    id: number;
    color: string;
    pieces: number;

    constructor(props) {
        this.id = INDEX++;
        this.color = props.color;
        this.pieces = props.pieces || NBR_PIECES;
    }

    play() {
        if(this.pieces == 0)
            return 0;

        return --this.pieces;
    }

    reset() {
        this.pieces = NBR_PIECES;
    }
}
