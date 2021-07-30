import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit,OnDestroy{
    private subsciprion:Subscription
    isAuthenticated=false;
    constructor(private dataStorageService:DataStorageService, private authServie:AuthService){}
    ngOnInit(){
        this.subsciprion=this.authServie.user.subscribe(user=>{
            this.isAuthenticated =!!user;
        });
    }
    onSaveData(){
        this.dataStorageService.storeRecipes();
    }
    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();
    }
    onLogout(){
        this.authServie.logout();
    }
    ngOnDestroy(){
        this.subsciprion.unsubscribe();
    }
}