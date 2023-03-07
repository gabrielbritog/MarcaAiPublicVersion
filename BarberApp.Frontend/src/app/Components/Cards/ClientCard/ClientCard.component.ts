import { Component, Input, OnInit } from '@angular/core';
import { ClientModel } from '../../../Models/ClientModel';

@Component({
  selector: 'app-ClientCard',
  templateUrl: './ClientCard.component.html',
  styleUrls: ['../baseCard.scss', './ClientCard.component.scss']
})
export class ClientCardComponent implements OnInit {

  @Input('model') clientModel = new ClientModel();

  constructor() { }

  ngOnInit() {
  }

  editClient() {

  }

}
