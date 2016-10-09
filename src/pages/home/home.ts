import { Component } from '@angular/core';
import { Http, Response }    from '@angular/http';

// import 'rxjs/Rx'; // <-- will add all rxjs operators
// import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import 'rxjs/operator/delay';
// import 'rxjs/operator/mergeMap';
// import 'rxjs/operator/switchMap';


import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url: string;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private http: Http) {
    // this.url = 'http://www.cnn.com';
    this.url = '/proxy';
  }

  ionViewDidLoad() {
    let prompt = this.alertCtrl.create({
      title: 'Load Url',
      message: "Enter a url for the service to load",
      inputs: [
        {
          name: 'url',
          placeholder: this.url
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked: ' + data.url);
            this.loadUrl();
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked: ' + data.url);
            this.url = data.url;
            this.loadUrl();
          }
        }
      ]
    });
    // prompt.present();
    this.loadUrl(); // <-- short cut so that we can test loading the page
  }

  private loadUrl() {
    console.log('loading ' + this.url);
    this.http.get(this.url).map(this.parseUrl).catch(this.handleError)
      .subscribe(
        data => console.log('urls', data.urls),
        error => console.log('err:', error)
        )
  }

  private parseUrl(res: Response) {
    var urls = res.text().match(/['\"]https?:[^\s]+['\"]/g);
    urls = urls
            .filter(str => str.indexOf("image")!=-1)
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
