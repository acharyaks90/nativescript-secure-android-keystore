import { Observable } from 'tns-core-modules/data/observable';

export class Common extends Observable {
  public message: string;

  constructor() {
    super();
    
  }

 
}


export enum ERROR_CODES {
  DEVELOPER_ERROR = 10, // Unexpected error, report to maintainer of plugin please
  TAMPERED_WITH = -5, // Datta changed since last successful authentication, maybe a hacker was on your device
}
