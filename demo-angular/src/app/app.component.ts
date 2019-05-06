import { Component } from "@angular/core";
import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent { 
    constructor(private secureAndroidKeystore: SecureAndroidKeystore){
        //this.secureAndroidKeystore = new SecureAndroidKeystore();
        this.secureAndroidKeystore.storeData('mykey','pass1234');
        this.secureAndroidKeystore.retrieveData('mykey').then(res=>{
        console.log('message', res );
        })
    }
}
