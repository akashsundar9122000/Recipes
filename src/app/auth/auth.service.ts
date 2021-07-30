import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Users } from "./user.model";

export interface AuthResponseData{ //resopense as per docs
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean //optional coz its only used in login not signup
}
@Injectable({providedIn:'root'})
export class AuthService{
    user = new BehaviorSubject<Users>(null);
    private tokenExipirationTimer:any;
    constructor(private http:HttpClient, private router:Router){}
    signUp(email:string , password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPGBjczfkJwBWAqc9VM74hEeGG5gaO5Nw',
        { //object according to the firebase auth restAPI docs
            email:email,
            password:password,
            returnSecureToken:true  //always should be true according to the docs
        }).pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn); //the + added before expires in to convert string to int
        }));
    }

    login(email:string,password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPGBjczfkJwBWAqc9VM74hEeGG5gaO5Nw',
        { //object according to the firebase auth restAPI docs
            email:email,
            password:password,
            returnSecureToken:true  //always should be true according to the docs
        }).pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn); //the + added before expires in to convert string to int
        }))
    }

    autoLogin(){
        const userData:{
            email:string;
            id:string;
            _token:string;
            _tokenExpirationDate:string;
        }=JSON.parse(localStorage.getItem('userData')); //convert string to JS object
        if(!userData){
            return;
        }

        const loadedUser = new Users(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));

        if(loadedUser.token){
            this.user.next(loadedUser); 
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); //this will get remaining time
            this.autoLogout(expirationDuration);
        }

    }

    
    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExipirationTimer){
            clearTimeout(this.tokenExipirationTimer);
        }
        this.tokenExipirationTimer=null;

    }

    autoLogout(expirationDuration:number){
        this.tokenExipirationTimer =  setTimeout(()=>{
            this.logout();
        } ,expirationDuration)
    }


    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number){
        const expirationDate=new Date(new Date().getTime()+ expiresIn*1000); 
        const user=new Users(email,userId,token,expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000); //that function expects millisecond
        localStorage.setItem('userData',JSON.stringify(user)); //convert JS object to string
    }

    private handleError(errorRes:HttpErrorResponse){
        let errorMessage='An unknown error occured'
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage='This email id already exists';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage='This is invalid email';
                break;
            case 'INVALID_PASSWORD':
                errorMessage='Invalid Password';
                break;
        }
        return throwError(errorMessage);
    }
}