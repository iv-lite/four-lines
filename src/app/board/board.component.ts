import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from './player';
import { BoardService } from './board.service';
import { Subscription } from 'rxjs';

const NBR_ROWS = 6;
const NBR_COLS = 7;

@Component({
  selector: 'l4-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  private $subscriptions: Subscription[];
  currentPlayer: Player;
  board: Player[][];

  constructor(
    private boardService: BoardService
  ) {
    this.$subscriptions = [];
    this.board = [...new Array(NBR_ROWS)].map( () => [...new Array(NBR_COLS)]);
    
    const sub = this.boardService.turn.subscribe(player => this.currentPlayer = player);

    this.$subscriptions.push(sub);
  }

  ngOnInit() {
    console.log(this.currentPlayer);
  }

  play(col: number) {
    const row = this.findDestination(col);
    console.log(row, col);
    if(row === undefined){
      return;
    }
    this.board[row][col] = this.currentPlayer;
    this.boardService.play();
    this.boardService.next();
  }

  findDestination(col: number) {
    for(let i = this.board.length - 1; i >= 0; i--) {
      if(this.board[i][col] === undefined) {
        return i;
      }
    }

    return undefined;
  }

  ngOnDestroy() {
    this.$subscriptions.forEach(sub => sub.unsubscribe());
  }
}
