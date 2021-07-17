import { Ingridents } from "../shared/ingridents.model";

export class Recipe{
    public name:string;
    public description:string;
    public imagePath:string;
    public ingridients : Ingridents[];
    constructor(name:string , desc : string , imagePath:string , ingridients : Ingridents[]){
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingridients = ingridients;
    }
}