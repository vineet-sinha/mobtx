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

  public getImgUrls(url: string): Observable<string[]> {
    return Observable.create(observer => {
      this.loadUrl(observer, url, []);
    }).map(this.extractContent).catch(this.handleError);
  }

  private loadUrl(observer, url, done) {
    this.http.get(url).subscribe(res => {
      this.checkNextPage(res, observer, url, done);
      observer.next(res); // push content for next process (the extractContent)
    });
  }

  private checkNextPage(res, observer, url, done) {
    var next = res.text().match(/href=.[^"]*page[^"]*. class=.btn btn-default./g);
    if (next==null) return; // no next page
    if (Object.keys(done).length>=10) return; // already loaded 10 pages

    next = next.map(nu => nu.substring("href=".length+1, nu.indexOf(" class")-1) );
    var nextUrl = next.find(nu => !done[nu] );

    var baseUrl = url.match(/^[^:]*:..[a-zA-Z.]*\//);
    if (!baseUrl) baseUrl = url.match(/^[^?]*/);
    baseUrl = baseUrl.map(s => { return s.endsWith('/') ? s.slice(0, -1) : s });

    console.log('next url:', baseUrl[0] + nextUrl);

    done[nextUrl] = true;
    this.loadUrl(observer, baseUrl[0] + nextUrl, done);
  }

  private extractContent(res: Response) {
    if (!res) {
      console.log('res is not defined');
      return {urls: ['res is not defined'], next: ['res is not defined']};
    }
    var urls = res.text().match(/['\"]https?:[^\s]+['\"]/g);
    if (urls == null) urls = [];
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
    console.error('err:', errMsg, error.stack);
    return Observable.throw(errMsg);
  }
}