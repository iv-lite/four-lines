import { Component, OnInit } from '@angular/core';
import { Player } from './player';

const NBR_ROWS = 6;
const NBR_COLS = 7;

@Component({
  selector: 'l4-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: Player[][];

  constructor() {
    this.board = [...new Array(NBR_ROWS)].map( () => [...new Array(NBR_COLS)]);
  }

  ngOnInit() {
    console.log(this.board);
  }

}
