import { Observable } from 'tns-core-modules/data/observable';
import { SecureAndroidKeystore } from 'nativescript-secure-android-keystore';

export class HelloWorldModel extends Observable {
  public message: string;
  private secureAndroidKeystore: SecureAndroidKeystore;

  constructor() {
    super();

    this.secureAndroidKeystore = new SecureAndroidKeystore();
    this.message = this.secureAndroidKeystore.message;
  }
}
