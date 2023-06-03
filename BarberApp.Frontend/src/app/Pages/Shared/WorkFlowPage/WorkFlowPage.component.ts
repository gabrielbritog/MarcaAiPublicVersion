import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Services/user/User.service';
import { WindowScrollDetectorDirective } from 'src/app/Directives/WindowScrollDetector/WindowScrollDetector.directive';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { WorkingDays } from 'src/app/Models/WorkingDays';
import { TokenStorageService } from 'src/app/Services/auth/token-storage.service';

@Component({
  selector: 'app-WorkFlowPage',
  templateUrl: './WorkFlowPage.component.html',
  styleUrls: ['../../Styles/baseSection.scss', './WorkFlowPage.component.scss']
})
export class WorkFlowPageComponent implements OnInit {
  @ViewChild(WindowScrollDetectorDirective) scrollDetector?: WindowScrollDetectorDirective;
  get scrolledUp() {
    if (this.scrollDetector)
      return this.scrollDetector.scrolledUp;

    return false;
  }

  _defaultWorkingDay = new WorkingDays({
    openingTime: '09:00',
    closingTime: '17:00'
  })

  get defaultWorkingDay() {
    return this._defaultWorkingDay;
  }
  set defaultWorkingDay(value) {
    this.defaultWorkingDay = value;
    this.workingDays.forEach(p => {
      p.openingTime = value.openingTime;
      p.closingTime = value.closingTime;
    })
  }

  _workingDaysBckp: WorkingDays[] = [];
  _workingDays: WorkingDays[] = [];
  get workingDays() {
    return this._workingDays;
  }
  set workingDays(value) {
    this._workingDays = value;
  }

  intervalTime: string = '00:30';

  _toggleAll = true;
  get toggleAll() {
    return this._toggleAll;
  }
  set toggleAll(value) {
    this._toggleAll = value;
    this.workingDays.forEach(p => p.isOpen = value);
  }

  get headerUrl() {
    let headerText = 'Horários de Funcionamento ';
    const routerUrl = this.router.url.split('/');
    switch (routerUrl[routerUrl.length - 1]) {
      case '/Name':
        headerText += '/ Editar Nome';
        break;
      case '/Email':
        headerText += '/ Editar Email';
        break;
      case '/Phone':
        headerText += '/ Editar Celular';
        break;
      case '/Password':
        headerText += '/ Alterar Senha';
        break;

    }

    return headerText;
  }

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    if (!this.tokenStorage.getToken())
      this.router.navigateByUrl('/Login');

    const userWorkingDays = GlobalVariables.userWorkingDays;
    this._workingDaysBckp = this.tokenStorage.getUserModel().workingDays!;
    if (!userWorkingDays || userWorkingDays?.length == 0) {
      this.workingDays = GlobalVariables.createWorkingDays();
    } else {
      this.workingDays = userWorkingDays;
    }

    this.intervalTime = this.workingDays[0].intervalTime;
  }

  onSubmit() {
    let hasChangedValues = this.validateChanges();

    if (!hasChangedValues) {
      this.toastr.warning('Nenhuma alteração feita.')
      return;
    }

    const apiCall = this.userService.updateWorkingDays(this._workingDays);
    apiCall.subscribe({
      next: (data) => {
        this.tokenStorage.saveUser(data.data);
        this.router.navigateByUrl('/Home');
      }
    })



  }

  onCancel() {
    let hasChangedValues = this.validateChanges();

    if (hasChangedValues && confirm('Descartar mudanças?') == false) {
      return;
    }

    if (this.router.url == '/WorkFlow')
      this.router.navigateByUrl('/Home');
    else
      this.router.navigateByUrl('/WorkFlow');
  }

  validateChanges() {
    let hasChangedValues = false;
    this._workingDays.forEach((p, index) => {
      p.intervalTime = this.intervalTime;
      let backupElement = this._workingDaysBckp[index];
      if (
        backupElement.intervalTime != p.intervalTime ||
        backupElement.openingTime != p.openingTime ||
        backupElement.closingTime != p.closingTime ||
        backupElement.isOpen != p.isOpen
      )
        hasChangedValues = true;
    });

    return hasChangedValues;
  }
}
