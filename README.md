# Secure data in android keystore 
 [Github](https://github.com/acharyaks90/nativescript-secure-android-keystore)

Encrypt the data and decrypt whenever want to use 
It save data in shared preferences using keystore encryption
Currently only works with Android 

## Prerequisites / Requirements
Android version Latest Version

## Installation

```javascript
tns plugin add nativescript-secure-android-keystore
```

## Usage 

Describe any usage specifics for your plugin. Give examples for Android, iOS, Angular if needed. See [nativescript-secure-android-keystore](https://www.npmjs.com/package/nativescript-secure-android-keystore)


## Javascript	
```javascript
            import { SecureAndroidKeystore } from "nativescript-secure-android-keystore";
            new SecureAndroidKeystore().storeData(keystoreKeyAlias: string, data: string);
```
## Typescript 
```typescript
     import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';

        
        private secureAndroidKeystore: SecureAndroidKeystore;

        //Inside some method         
            this.secureAndroidKeystore = new SecureAndroidKeystore();
            this.secureAndroidKeystore.storeData('mykey','pass1234');
            this.secureAndroidKeystore.retrieveData('mykey').then(res=>{
            this.message = res;
            console.log('message', this.message );
        
 ```

 ## Angular Typescript 
```typescript
app.module.ts
    ...
     import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';
     ....
     
@NgModule({
    .
    .
    .
    bootstrap: [
        AppComponent
    ],
  
    providers: [
        SecureAndroidKeystore
    ],
    .
    .
    .
})

any.component.ts

        ...
     import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';
     ....

     constructor(private secureAndroidKeystore: SecureAndroidKeystore){

     }
        
     anyMethod(){
          //Inside some method         
            this.secureAndroidKeystore.storeData('mykey','pass1234');
            this.secureAndroidKeystore.retrieveData('mykey').then(res=>{
            this.message = res;
            console.log('message', this.message );
     }
       
        
 ```


## API
    
| Property | Default | Description |
| --- | --- | --- |
| Store data method | storeData('key', 'passdata') | method for saving any data,  |
| Get the data |retrieveData | Method for data getting and using which return promise |
    
## License

Apache License Version 2.0, January 2004

## For Any issue please raise issue in github repo 
