import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  }
  ionViewDidLoad() {
    let prompt = this.alertCtrl.create({
      title: 'Load Url',
      message: "Enter a url for the service to load",
      inputs: [
        {
          name: 'url',
          placeholder: 'http://www.cnn.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked: ' + data.url);
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked: ' + data.url);
          }
        }
      ]
    });
    prompt.present();
  }
}
