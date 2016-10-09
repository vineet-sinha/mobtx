import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

// import 'rxjs/Rx'; // <-- will add all rxjs operators
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import 'rxjs/operator/delay';
// import 'rxjs/operator/mergeMap';
// import 'rxjs/operator/switchMap';


@Injectable()
export class TxService {
  constructor (private http: Http) {}

  public getImgUrls(url: string) {
    return this.http.get(url).map(this.parseUrl).catch(this.handleError);
  }

  private parseUrl(res: Response) {
    var urls = res.text().match(/['\"]https?:[^\s]+['\"]/g);
    urls = urls
            .filter(str => str.indexOf("image")!=-1)
            .filter(str => str.indexOf("30x30")==-1)
            .filter(str => str.indexOf("60x60")==-1)
            .filter(str => str.indexOf("?site=")==-1)
            .map(str => str.substring(1, str.length-1) );
    console.log('urls.length:', urls.length);
    return {urls: urls};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error('err:', errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}