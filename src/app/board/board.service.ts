import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from './player';

const P1_COLOR = 'yellow';
const P2_COLOR = 'red';

@Injectable()
export class BoardService {
  private players: Player[];
  private turns: number;
  private _turn: BehaviorSubject<Player>;

  constructor() {
    this.reset();
  }

  reset() {
    this.turns = 0;
    this.players = [P1_COLOR, P2_COLOR].map(color => new Player({ color }));
    this._turn = new BehaviorSubject<Player>(this.players[this.turns]);
  }

  get turn() {
    return this._turn.asObservable();
  }

  play() {
    return this._turn.value.play();
  }

  next() {
    this._turn.next(this.players[++this.turns % 2]);
  }
}
