import { Observable } from 'tns-core-modules/data/observable';
import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';

export class HelloWorldModel extends Observable {
  public message: string;
  private secureAndroidKeystore: SecureAndroidKeystore;

  constructor() {
    super();

    this.secureAndroidKeystore = new SecureAndroidKeystore();
     this.secureAndroidKeystore.storeData('mykey','pass1234');
     this.secureAndroidKeystore.retrieveData('mykey').then(res=>{
      this.message = res;
      console.log('message', this.message );
    })
  }
}
