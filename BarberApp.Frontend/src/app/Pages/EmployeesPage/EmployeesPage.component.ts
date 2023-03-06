import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { TokenStorageService } from '../../Services/token-storage.service';

@Component({
  selector: 'app-EmployeesPage',
  templateUrl: './EmployeesPage.component.html',
  styleUrls: ['../../Shared/Styles/basePage.scss', './EmployeesPage.component.scss']
})
export class EmployeesPageComponent implements OnInit {

  searchValue = "";

  get headerUrl() {
    let header = 'Funcionários'
    const route = this.router.url.split('/');
    const lastRoute = route[route.length -1];
    switch (lastRoute) {
      case 'New':
        header += ' / Novo'
        break;
      case 'Edit':
        header += ' / Editar'
        break;

      default:
        break;
    }

    return header;
  }

  get showModal() {
    return GlobalVariables.showBarberModal;
  };

  get barberList(){
    return GlobalVariables.barbers
    .filter(p =>
      (p.firstName.toLowerCase() + ' ' + p.lastName.toLowerCase()).includes(this.searchValue.toLowerCase()) ||
      p.phoneNumber?.toLowerCase().includes(this.searchValue.toLowerCase())
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.tokenStorage.getToken())
      this.router.navigateByUrl('/Login');

    if (!GlobalVariables.appLoaded)
      this.router.navigateByUrl('/Home');

  }

  newBarber() {
    GlobalVariables.showBarberModal = true;
  }

  onCancel() {
    if (this.router.url == '/Employees') {
      if(GlobalVariables.barbers.length > 0)
        this.router.navigateByUrl('/Home');
    }
    else
      this.router.navigateByUrl('/Employees');
  }

}
