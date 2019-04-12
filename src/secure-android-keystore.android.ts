import { Common, ERROR_CODES } from './secure-android-keystore.common';
import * as utils from "tns-core-modules/utils/utils";

export class SecureAndroidKeystore extends Common {

    private keystoreKeyAlias: string;
    private data: string;
    private keyStore: java.security.KeyStore;
    private cipher: javax.crypto.Cipher;
    private cipherInEncryptMode: boolean;
    private encryptionIv: any;
    private promiseResolve; // Used for async/callback 
    private promiseReject; // Used for async/callback

    constructor() {
        super();
    }
    
    /**
      * @jsdoc method
      * @name storeData
      * @description Encrypt the data and store it in shared preference of android 
      * @memberof NsfsecureService
      * @param keystoreKeyAlias
      * @param data 
      */
    storeData(keystoreKeyAlias: string, data: string): Promise<void> {

        return new Promise((resolve, reject) => {
          this.promiseResolve = resolve;
          this.promiseReject = reject;
          try {
            this.keystoreKeyAlias = keystoreKeyAlias;
            this.data = data;
            this.cipherInEncryptMode = true;
            this.createKey(keystoreKeyAlias);
            this.onAuthenticationSucceeded()
          } catch (ex) {
            console.trace(ex);
            this.deleteEncryptedData(keystoreKeyAlias);
            reject({
              code: ERROR_CODES.DEVELOPER_ERROR,
              message: ex.message,
            });
          }
        });
      }
    
      /**
      * @jsdoc method
      * @name retrieveData
      * @description Decypt the data and return it from shared preference of android
      * @memberof NsfsecureService
      * @param keystoreKeyAlias
      */
      retrieveData(keystoreKeyAlias: string): Promise<string> {
    
        return new Promise((resolve, reject) => {
          this.promiseResolve = resolve;
          this.promiseReject = reject;
          try {
            this.cipherInEncryptMode = false;
            this.keystoreKeyAlias = keystoreKeyAlias;
            this.onAuthenticationSucceeded();
          } catch (ex) {
            this.deleteEncryptedData(keystoreKeyAlias);
            reject({
              code: ERROR_CODES.DEVELOPER_ERROR,
              message: ex.message,
            });
          }
        });
      }
     /**
      * @jsdoc method
      * @name encryptedDataExists
      * @description Check the existence of encrypted data in  shared preference of android
      * @memberof NsfsecureService
      * @param keystoreKeyAlias
      */
      encryptedDataExists(keystoreKeyAlias: string): boolean {
        this.keystoreKeyAlias = keystoreKeyAlias;
        const preferences = android.preference.PreferenceManager.getDefaultSharedPreferences(utils.ad.getApplicationContext());
        return preferences.contains(SecureAndroidKeystore.name + this.keystoreKeyAlias);
      }
     /**
      * @jsdoc method
      * @name encryptedDataExists
      * @description Delete encrypted data in  shared preference of android
      * @memberof NsfsecureService
      * @param keystoreKeyAlias
      */
      deleteEncryptedData(keystoreKeyAlias: string): void {
        this.keystoreKeyAlias = keystoreKeyAlias;
        const preferences = android.preference.PreferenceManager.getDefaultSharedPreferences(utils.ad.getApplicationContext());
        preferences.edit().remove(SecureAndroidKeystore.name + this.keystoreKeyAlias).apply();
      }
    
       /**
      * @jsdoc method
      * @name createKey
      * @description Generate the key by Createing the keystore named 'AndroidKeyStore' using  ALGORITHM AES , BLOCK_MODE_CBC and ENCRYPTION_PADDING_PKCS7
      * @memberof NsfsecureService
      * @param keystoreKeyAlias
      */

      private createKey(keystoreKeyAlias: string): void {
        try {
          this.keyStore = java.security.KeyStore.getInstance('AndroidKeyStore');
          this.keyStore.load(null);
          const keyGenerator = javax.crypto.KeyGenerator.getInstance(android.security.keystore.KeyProperties.KEY_ALGORITHM_AES, 'AndroidKeyStore');
    
          keyGenerator.init(
            new android.security.keystore.KeyGenParameterSpec.Builder(keystoreKeyAlias, android.security.keystore.KeyProperties.PURPOSE_ENCRYPT | android.security.keystore.KeyProperties.PURPOSE_DECRYPT)
              .setBlockModes([android.security.keystore.KeyProperties.BLOCK_MODE_CBC])
              .setEncryptionPaddings([android.security.keystore.KeyProperties.ENCRYPTION_PADDING_PKCS7])
              .setKeySize(256)
              .build()
          );
          keyGenerator.generateKey();
        } catch (ex) {
          console.trace(ex);
          this.promiseReject({
            code: ERROR_CODES.DEVELOPER_ERROR,
            message: ex.message,
          });
        }
      }
    
    
   /**
      * @jsdoc method
      * @name initCipher
      * @description Start the cipher for encryption and decryption
      * @memberof NsfsecureService
      * @param mode : number 
      * @param keystoreKeyAlias
      */
      private initCipher(mode: number, keystoreKeyAlias: string): void {
        try {
          this.keyStore = java.security.KeyStore.getInstance('AndroidKeyStore');
          this.keyStore.load(null);
          const key = this.keyStore.getKey(keystoreKeyAlias, null);
          this.cipher = javax.crypto.Cipher.getInstance(`${android.security.keystore.KeyProperties.KEY_ALGORITHM_AES}/${android.security.keystore.KeyProperties.BLOCK_MODE_CBC}/${android.security.keystore.KeyProperties.ENCRYPTION_PADDING_PKCS7}`);
          //this.cryptoObject = new android.hardware.fingerprint.FingerprintManager.CryptoObject(this.cipher);
          if (mode === javax.crypto.Cipher.ENCRYPT_MODE) {
            this.cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, key);
          } else {
            if (key != null) {
              const preferences = android.preference.PreferenceManager.getDefaultSharedPreferences(utils.ad.getApplicationContext());
              const ivString = preferences.getString(SecureAndroidKeystore.name + keystoreKeyAlias + "_encryption_iv", null);
              if (ivString != null) {
                const javaString = new java.lang.String(new java.lang.StringBuffer(ivString));
                this.encryptionIv = android.util.Base64.decode(javaString.getBytes("UTF-8"), android.util.Base64.DEFAULT);
                this.cipher.init(javax.crypto.Cipher.DECRYPT_MODE, key, new javax.crypto.spec.IvParameterSpec(this.encryptionIv));
              }
            } else {
              this.promiseReject({
                code: ERROR_CODES.DEVELOPER_ERROR,
                message: "IV not found while decrypting.",
              });
            }
          }
        } catch (ex) {
          console.trace(ex);
          if (ex instanceof android.security.keystore.KeyPermanentlyInvalidatedException) {
            this.promiseReject({
              code: ERROR_CODES.TAMPERED_WITH,
              message: ex.getMessage(),
            });
          } else {
            this.promiseReject({
              code: ERROR_CODES.DEVELOPER_ERROR,
              message: ex.message,
            });
          }
        }
      }
       /**
      * @jsdoc method
      * @name tryEncrypt
      * @description Encrypt the string and store in shared preferences 
      * @memberof NsfsecureService
      * @param secret : string input
      */

      private tryEncrypt(secret: java.lang.String): void {
        try {
          this.encryptionIv = this.cipher.getIV();
          const encrypted = new java.lang.String(android.util.Base64.encode(this.cipher.doFinal(secret.getBytes("UTF-8")), android.util.Base64.DEFAULT), "UTF-8").toString();
          const preferences = android.preference.PreferenceManager.getDefaultSharedPreferences(utils.ad.getApplicationContext());
          // Store IV alongside encrypted data because we need it for decryption. IV makes it harder to decipher the  for a hacker with access to the device data
          const ivString = new java.lang.String(android.util.Base64.encode(this.encryptionIv, android.util.Base64.DEFAULT), "UTF-8").toString();
          preferences.edit().putString(SecureAndroidKeystore.name + this.keystoreKeyAlias, encrypted).putString(SecureAndroidKeystore.name + this.keystoreKeyAlias + "_encryption_iv", ivString).apply();
        } catch (ex) {
          console.trace(ex);
          this.promiseReject({
            code: ERROR_CODES.DEVELOPER_ERROR,
            message: ex.message,
          });
        }
      }
       /**
      * @jsdoc method
      * @name tryDecrypt
      * @description decrypt the string and and return
      * @memberof NsfsecureService
      */
      private tryDecrypt(): string {
        try {
          const preferences = android.preference.PreferenceManager.getDefaultSharedPreferences(utils.ad.getApplicationContext());
          const sb = new java.lang.StringBuffer(preferences.getString(SecureAndroidKeystore.name + this.keystoreKeyAlias, ""));
          const secret = android.util.Base64.decode(new java.lang.String(sb).getBytes("UTF-8"), android.util.Base64.DEFAULT);
          const decrypted = this.cipher.doFinal(secret);
          return new java.lang.String(decrypted, "UTF-8").toString();
        } catch (ex) {
          console.trace(ex);
          this.promiseReject({
            code: ERROR_CODES.DEVELOPER_ERROR,
            message: ex.message,
          });
        }
        return null;
      }
    
    
   /**
      * @jsdoc method
      * @name onAuthenticationSucceeded
      * @description encryp or decrypt the string and and return promise
      * @memberof NsfsecureService
      */
      public onAuthenticationSucceeded() {
        if (this.cipherInEncryptMode) {
          this.initCipher(javax.crypto.Cipher.ENCRYPT_MODE, this.keystoreKeyAlias);
          this.tryEncrypt(new java.lang.String(this.data));
          this.promiseResolve();
        } else {
          this.initCipher(javax.crypto.Cipher.DECRYPT_MODE, this.keystoreKeyAlias);
          const decrypted = this.tryDecrypt();
          //console.log(decrypted);
          this.promiseResolve(decrypted);
        }
    
    
      }
}
