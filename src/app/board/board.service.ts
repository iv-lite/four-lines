import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from './player';

const P1_COLOR = 'red';
const P2_COLOR = 'yellow';

/**
 * @Injectable Manage based turn games.
 */
@Injectable()
export class BoardService {
  private players: Player[];
  private turns: number;
  private _turn: BehaviorSubject<Player>;

  /**
   * At the begenning BoardService initialize to players with P1_COLOR 
   * and P2_COLOR as respective color. Number of pieces for each players 
   * is the same as it is the default from Player class.
   * And the reset method is applied once.
   *
   * @return  [return description]
   */
  constructor() {

    this.players = [P1_COLOR, P2_COLOR].map(( color, index) => new Player({ id: index, color }));
    this.reset();
  }

  /**
   * Reset the match state by resetting the number of turns to 0 
   * resetting each player and giving the turn to first player in the 
   * array of player or the next player if game as started.
   *
   * @return  {[type]}  [return description]
   */
  reset() {
    this.turns = 0;
    this.players.forEach(player => player.reset());
    if(this._turn == undefined)
      this._turn = new BehaviorSubject<Player>(this.players[this.turns]);
    else
      this.next();
  }

  get turn() {
    return this._turn.asObservable();
  }

  /**
   * Playing means making the current player play.
   *
   * @return  {[type]}  Number of play left for the player.
   */
  play() {
    return this._turn.value.play();
  }

  /**
   * Insert the next player as candidate for next turn.
   *
   * @return  void
   */
  next() {
    this._turn.next(this.players[this.turns++ % 2]);
  }
}
