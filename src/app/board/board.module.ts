import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { BoardComponent } from './board.component';

const ROUTES: Route[] = [
  { path: '', component: BoardComponent}
];

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class BoardModule { }
