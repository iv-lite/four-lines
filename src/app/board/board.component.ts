import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from './player';
import { BoardService } from './board.service';
import { Subscription } from 'rxjs';

const NBR_ROWS = 6;
const NBR_COLS = 7;

/**
 * Board l4-board selector's component.
 */
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

  /**
   * Initialize by calling reset once, and
   * subscribing to turn based system to switch player.
   */
  constructor(
    private boardService: BoardService
  ) {
    this.$subscriptions = [];
    this.reset();
    
    const sub = this.boardService.turn.subscribe(player => this.currentPlayer = player);

    this.$subscriptions.push(sub);
  }

  ngOnInit() {
  }

  /**
   * The play method is meant to be called on a col.
   * This method does nothing if the game as no play left or if there is 
   * a winner.
   * 
   * Playing to a col means finding the lowest in height row on which no 
   * player is set and setting the position as the currentPlayer.
   * 
   * Then if the game is not wone by the current player after that play 
   * by calling next on the BoardService.
   * If the currentPlayer wins the game then it is set as the winner.
   *
   * @param   col 
   *
   * @return  void
   */
  play(col: number) {
    this.resetHighlight();

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

  /**
   * Check if the last play of currentPlayer as made him win the game.
   *
   * @param row  row position
   * @param col  col position
   *
   * @return  if the game is one with last play.
   */
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

  /**
   * Checks a line by incrementing current position by respective dirRow 
   * and dirCol directions, adding 1 to the total of points of continuing 
   * line result or zero if current player doesn't have a point on 
   * current position.
   *
   * @param   row
   * @param   col
   * @param   dirRow
   * @param   dirCol
   *
   * @return  number of points of the maximum size line in that direction.
   */
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

  /**
   * Toggle all pieces in the col highlight class.
   *
   * @param   col
   *
   * @return  void
   */
  toggleHighlight(col) {
    if(this.winner != undefined)
      return;

    const tbody = document.getElementById('board').querySelector('tbody');
    for (let i = 0; i < this.board.length; i++) {
      const el = tbody.children[i].children[col].querySelector('.piece');
      el.classList.toggle('highlight');
    }
  }

  /**
   * Resets highlight state of the given col.
   */
  resetHighlight() {
    const tbody = document.getElementById('board').querySelector('tbody');
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const el = tbody.children[i].children[j].querySelector('.piece');
        el.classList.remove('highlight');
      }
    }
  }

  /**
   * Find the lowest in height undefined piece location in the given col.
   * 
   * @param col 
   */
  findDestination(col: number) {
    for(let i = this.board.length - 1; i >= 0; i--) {
      if(this.board[i][col] === undefined) {
        return i;
      }
    }

    return undefined;
  }

  /**
   * Resets the current game by resetting the board the BoardService as well as setting the winner to undefined.
   */
  reset() {
    this.board = [...new Array(NBR_ROWS)].map( () => [...new Array(NBR_COLS)]);
    this.boardService.reset();
    this.winner = undefined;
  }

  ngOnDestroy() {
    this.$subscriptions.forEach(sub => sub.unsubscribe());
  }
}
