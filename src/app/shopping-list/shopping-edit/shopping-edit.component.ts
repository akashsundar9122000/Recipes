import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingridents } from '../../shared/ingridents.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f',{static:false}) slForm:NgForm;
subscription : Subscription;
 editMode=false;
 editedItemIndex:number;
 editedItem:Ingridents;
  constructor(private slService : ShoppingListService) { }

  ngOnInit(): void {
    this.subscription=this.slService.startedEditingItem.subscribe(
      (index:number)=>{
        this.editedItemIndex=index;
        this.editMode=true;
        this.editedItem=this.slService.getIngrident(index);
        this.slForm.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        })
      }
    )
  }
  onAdd(form:NgForm){
   const value=form.value;
    const newIngridient = new Ingridents(value.name , value.amount);
    if(this.editMode){
      this.slService.updateIngridients(this.editedItemIndex , newIngridient);
    } else{
      this.slService.addIngrident(newIngridient);
    }
    this.editMode=false;
    form.reset();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onDelete(){
    this.slService.deleteIngridients(this.editedItemIndex);
    this.onClear();
  }
  onClear(){
    this.slForm.reset();
    this.editMode=false;
  }

}
