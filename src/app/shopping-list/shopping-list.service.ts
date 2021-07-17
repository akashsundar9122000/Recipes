
import { Ingridents } from "../shared/ingridents.model";
import { Subject } from "rxjs";

export class ShoppingListService{
    ingridentChanged = new Subject<Ingridents[]>();
    startedEditingItem = new Subject<number>();
    private ingridients: Ingridents[] = [
        new Ingridents('Apple' , 5),
        new Ingridents('Banana' , 10)
      ];

    getIngrident(index:number){
        return this.ingridients[index];
    }
    getIngridents(){
        return this.ingridients.slice();
    }

    addIngrident(ing : Ingridents){
        this.ingridients.push(ing);
        this.ingridentChanged.next(this.ingridients.slice());
    }
    addIngridients(ingridients:Ingridents[]){
        this.ingridients.push(...ingridients);
        this.ingridentChanged.next(this.ingridients.slice());
    }
    updateIngridients(index: number , newIngridient:Ingridents){
        this.ingridients[index]=newIngridient;
        this.ingridentChanged.next(this.ingridients.slice());
    }
    deleteIngridients(index:number){
        this.ingridients.splice(index,1);
        this.ingridentChanged.next(this.ingridients.slice());
    }
}