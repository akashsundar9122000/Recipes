import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingridents } from "../shared/ingridents.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
@Injectable()
export class RecipeService{
   
   private recipes : Recipe[] =[
        new Recipe('Test' , 
        'Test Description' ,
         'https://www.simplyrecipes.com/thmb/zYYil--NI8jIPByzHdqF9viJYBE=/1629x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-LEAD-4-7d8b34fc12c940a5975216d4b6420ed4.jpg' ,
        [
            new Ingridents('Meat' , 1),
            new Ingridents('Fries' , 20)
        ]),
        new Recipe('Test' , 'Test Description' , 'https://www.simplyrecipes.com/thmb/zYYil--NI8jIPByzHdqF9viJYBE=/1629x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-LEAD-4-7d8b34fc12c940a5975216d4b6420ed4.jpg',
        [
            new Ingridents('Bun' , 1),
            new Ingridents('Bread' , 20)
        ])
      ];
      constructor(private slService : ShoppingListService){}
      recipesChanged = new Subject<Recipe[]>();
      getRecipe(){
          return this.recipes.slice();
      }
      getId(index:number){
          return this.recipes.slice()[index];
      }
      addIngridientsToShoppingList(ingridients : Ingridents[]){
            this.slService.addIngridients(ingridients);
      }
      addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }
      updateRecipe(index:number , newRecipe:Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }
      deleteRecipe(index:number){
          this.recipes.splice(index,1);
          this.recipesChanged.next(this.recipes.slice());
      }
}