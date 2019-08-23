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
  winner: Player;
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
    document.addEventListener('mousemove', e => {
      const target = document.getElementById('current-player-piece');
      const x = e.pageX - target.getBoundingClientRect().left;
      const pos = target.offsetLeft;
      const diff = Math.abs(x - pos);

      if(Math.abs(diff) <= document.querySelector('.board').clientWidth)
        target.style.transform = `translateX(${diff}px)`;
    });
  }

  play(col: number) {
    if(this.boardService.play() == 0 || this.winner !== undefined)
      return;

    const row = this.findDestination(col);
    if(row === undefined){
      return;
    }
    this.board[row][col] = this.currentPlayer;
    if(!this.check(row, col))
      this.boardService.next();
    else
      this.winner = this.currentPlayer;
  }

  check(row: number, col: number) {
    const results = [
      // diagonals
      this.line(row, col, -1, -1) + 1 + this.line(row, col, 1, 1),
      this.line(row, col, -1, 1) + 1 + this.line(row, col, 1, -1),
      // horizontal and vertical
      this.line(row, col, 0, 1) + 1 + this.line(row, col, 0, -1),
      this.line(row, col, -1, 0) + 1 + this.line(row, col, 1, 0),
    ];
    return results.find(res => res >= 4);
  }

  line(row: number, col: number, dirRow: number, dirCol: number) {
    const i = row + dirRow;
    const j = col + dirCol;

    if(i < 0 || i >= NBR_ROWS)
      return 0;

    if(j < 0 || j >= NBR_COLS)
      return 0;

    if(this.board[i][j] == undefined || this.board[i][j].id !== this.currentPlayer.id )
      return 0;

    return 1 + this.line(i, j, dirRow, dirCol);
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
