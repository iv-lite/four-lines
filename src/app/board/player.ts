const NBR_PIECES = 21;

export class Player {
    id: number;
    color: string;
    pieces: number;

    constructor(props) {
        this.id = props.id;
        this.color = props.color;
        this.pieces = props.pieces || NBR_PIECES;
    }

    play() {
        if(this.pieces == 0)
            return 0;

        return --this.pieces;
    }
}
