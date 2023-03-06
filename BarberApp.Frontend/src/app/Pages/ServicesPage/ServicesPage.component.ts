import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../Services/token-storage.service';

@Component({
  selector: 'app-ServicesPage',
  templateUrl: './ServicesPage.component.html',
  styleUrls: ['../../Shared/Styles/basePage.scss', './ServicesPage.component.scss']
})
export class ServicesPageComponent implements OnInit {

  get headerUrl() {
    let header = 'Serviços'
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
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    // if (!this.tokenStorage.getToken())
    //   this.router.navigateByUrl('/Login');

    // if (!GlobalVariables.appLoaded)
    //   this.router.navigateByUrl('/Home');

  }

  onCancel() {
    if (this.router.url == '/Services')
      this.router.navigateByUrl('/Home');
    else
      this.router.navigateByUrl('/Services');
  }


}
