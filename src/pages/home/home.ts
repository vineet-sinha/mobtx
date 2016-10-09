import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.url = 'http://www.cnn.com';
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
    prompt.present();
  }

  loadUrl() {
    console.log('loading ' + this.url);
  }

}
