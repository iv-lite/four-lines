const NBR_PIECES = 21;

let INDEX = 0;

/**
 * Player model
 */
export class Player {
    id: number;
    color: string;

    // number of pieces left
    pieces: number;

    /**
     * A player with initial properties.
     * "id" increments with each new playing beeing created.
     * 
     *
     * @param  props  object with color as a string property and pieces as a number of pieces at the beginning.
     *
     * @return        A new Player
     */
    constructor(props) {
        this.id = INDEX++;
        this.color = props.color;
        this.pieces = props.pieces || NBR_PIECES;
    }

    /**
     * Playing means loosing a piece.
     *
     * @return  The new number of pieces
     */
    play(): number {
        if(this.pieces == 0)
            return 0;

        return --this.pieces;
    }

    /**
     * Reset the player making him able to play again if he was without 
     * anymore plays.
     *
     * @return  void
     */
    reset() {
        this.pieces = NBR_PIECES;
    }
}
