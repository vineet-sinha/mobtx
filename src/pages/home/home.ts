import { Component } from '@angular/core';
import { Http }    from '@angular/http';

import { TxService } from '../home/tx.service';


import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  providers: [TxService],
  templateUrl: 'home.html'
})
export class HomePage {

  url: string;
  imgs: string[];

  constructor(
    private navCtrl: NavController, 
    private alertCtrl: AlertController, 
    private http: Http, 
    private txSvc: TxService, 
    private storage: Storage) {

    this.url = '';
    this.storage.get('url').then((data) => {
      if (data != null) {
        this.url = data;
      } else {
        this.url = 'http://www.cnn.com';
        this.storage.set('url', this.url);
      }
    });

    // this.url = 'http://www.cnn.com';
    // this.url = '/proxy';
    // this.storage.set('url', this.url);
    this.imgs = [];
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
            if (data.url != '') {
              this.url = data.url;
              this.storage.set('url', data.url);
            }
            this.loadUrl();
          }
        }
      ]
    });
    prompt.present();
    this.loadUrl(); // <-- short cut so that we can test loading the page
  }

  public swipe(e, ndx) {
    // console.log('swipe', e.angle, ndx);
    this.imgs.splice(ndx, 1);
  }

  private loadUrl() {
    this.imgs = [];
    console.log('loading ' + this.url);
    this.txSvc.getImgUrls(this.url)
      .subscribe(
        data => {
          if (this.imgs.length<100) this.imgs = this.imgs.concat(data.urls);
        },
        error => console.log('err:', error)
      );
  }

}
