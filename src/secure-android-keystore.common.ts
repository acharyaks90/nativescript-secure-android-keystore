import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export class Common extends Observable {
  public message: string;

  constructor() {
    super();
    this.message = Utils.SUCCESS_MSG();
  }

  public greet() {
    return "Hello, NS";
  }
}

export class Utils {
  public static SUCCESS_MSG(): string {
    let msg = `Your plugin is working on ${app.android ? 'Android' : 'iOS'}.`;

    setTimeout(() => {
      dialogs.alert(`${msg} For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
    }, 2000);

    return msg;
  }
}


export enum ERROR_CODES {
  RECOVERABLE_ERROR_BIOMETRICS_NOT_RECOGNIZED = 102, // Biometrics are working and configured correctly, but the biometric input was not recognized
  RECOVERABLE_ERROR_FINGER_MOVED_TO_FAST = 102, // Finger moved to fast on the fingerprint sensor (only Android)
  RECOVERABLE_ERROR_FINGER_MUST_COVER_SENSOR = 101, // Finger must cover entire sensor (only Android)
  DEVELOPER_ERROR = 10, // Unexpected error, report to maintainer of plugin please
  NOT_AVAILABLE = 20, // Biometrics are not available on device
  TAMPERED_WITH = -5, // Biometrics was changed (added or removed) since last successful authentication, maybe a hacker was on your device
  AUTHENTICATION_FAILED = -1, // Biometrics are working and configured correctly, but the biometric input was not recognized
  CANCEL = -2 // Biometric authentication was canceled, probably by user
}
