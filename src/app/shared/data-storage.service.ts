import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import {exhaustMap, map , take, tap} from 'rxjs/operators'
import { AuthService } from "../auth/auth.service";
@Injectable({providedIn:'root'})

export class DataStorageService{

    constructor(private http:HttpClient, private recipeService:RecipeService, private authService:AuthService){}

    storeRecipes(){
        const recipes=this.recipeService.getRecipe();
        this.http.put('https://recipes-bdb51-default-rtdb.firebaseio.com/recipes.json',recipes).subscribe(
        response=>{
            console.log(response);
        }
        );
    }

    fetchRecipes(){
        
            return this.http.get<Recipe[]>('https://recipes-bdb51-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(recipes=>{ //this map in rxjs operatir
                return recipes.map(recipe=>{
                    return {...recipe,ingridients:recipe.ingridients? recipe.ingridients:[]}
                }); // this map is JS array function
            }),
            tap(recipes =>{
                this.recipeService.setRecipes(recipes);
            }))
    
    }
}