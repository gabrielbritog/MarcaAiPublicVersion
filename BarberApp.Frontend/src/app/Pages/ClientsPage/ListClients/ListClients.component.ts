import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { UserModel } from 'src/app/Models/UserModel';

@Component({
  selector: 'app-ListClients',
  templateUrl: './ListClients.component.html',
  styleUrls: ['./ListClients.component.scss']
})
export class ListClientsComponent implements OnInit {

  searchValue = "";

  get clientList() {
    return GlobalVariables.schedules
    .map(p => new UserModel({ firstName: p.client.name, phoneNumber: p.client.phone}))
    .filter(p => p.firstName != "")
    .filter(p =>
      p.firstName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      p.phoneNumber?.toLowerCase().includes(this.searchValue.toLowerCase())
    )
    .filter((cName, index, self) => self.map(p => p.phoneNumber).includes(cName.phoneNumber, index + 1) === false)
    .sort((a, b) => a.firstName.localeCompare(b.firstName));
  };

  constructor() { }

  ngOnInit() {
  }

}
