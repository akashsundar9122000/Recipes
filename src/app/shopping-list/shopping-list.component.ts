import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {Ingridents} from '../shared/ingridents.model';
import { ShoppingListService } from './shopping-list.service';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingridients: Ingridents[];
  private igChanged : Subscription;
  constructor(private slService : ShoppingListService) { }

  ngOnInit(): void {
    this.ingridients = this.slService.getIngridents();
    this.igChanged = this.slService.ingridentChanged.subscribe(
      (ingridients: Ingridents[]) =>{
        this.ingridients = ingridients;
      }
    )
  }
  onEditItem(index : number){
    this.slService.startedEditingItem.next(index);
  }
 ngOnDestroy():void{
   this.igChanged.unsubscribe();
 }
}
