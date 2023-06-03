import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { ClientModel } from '../../../../Models/ClientModel';
import { ClassesFrontModel, ClassesUtilities } from '../../../../Models/ClassesModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from '../../../../Services/api/Classes.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DefaultTable } from 'src/app/Components/Tables/default-table/default-table';

@Component({
  selector: 'app-ClassDetails',
  templateUrl: './ClassDetails.component.html',
  styleUrls: ['../../../Styles/baseSection.scss', './ClassDetails.component.css']
})
export class ClassDetailsComponent implements OnInit, OnDestroy {
  id: string = '';
  subscription?: Subscription;



  classModel!: ClassesFrontModel;
  get selectedClass() {
    return GlobalVariables.selectedClass;
  }
  set selectedClass(value) {
    GlobalVariables.selectedClass = value;
  }

  get isAdmin() {
    return GlobalVariables.isAdmin;
  }

  searchValue = '';

  get clientList() {
    return GlobalVariables.clients
      .filter(p=> p.name.toLowerCase().includes(this.searchValue))
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((b, a) => {
        if (this.classModel.clientsModel.some(p => p.clientId === a.clientId))
          return -1;
        if (this.classModel.clientsModel.some(p => p.clientId === b.clientId))
          return 1;

        return 0;
      })
  }

  clientsTable() {
    const table: DefaultTable = {
      titles: ['Aluno', 'Cadastro N°', ''],
      objects: [],
      onClick: (event: any) => this.addClientEventToClass(event)
    }

    GlobalVariables.clients.forEach(client => {
      table.objects.push({
        object: {
          name: client.name,
          registerNumber: client.registerNumber,
          checkbox: this.hasClient(client),
          onChange: (clientId: string) => this.addClientIdToClass(clientId),
          id: client.clientId,
        }
      })
    })

    return table;
  }

  hasClient(client: ClientModel) {
    if (!client.clientId)
      return false;

    return this.hasClientId(client.clientId);
  }

  hasClientId(clientId: string) {
    return this.classModel.clientsModel.some(p => p.clientId == clientId);
  }

  addClientIdToClass(clientId: string) {
    const client = GlobalVariables.clients.find(p => p.clientId === clientId);

    if (!client)
      return;

    if (this.classModel.clientsModel.some(p => p == client)){
      this.classModel.clientsModel = this.classModel.clientsModel.filter(p => p !== client);
    }
    else{
      this.classModel.clientsModel.push(client);
    }
  }

  addClientToClass(client: ClientModel) {
    if (client.clientId)
      this.addClientIdToClass(client.clientId)
  }

  addClientEventToClass(event: any) {
    if (!event.object?.id)
      return;

    this.addClientIdToClass(event.object.id);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private classesService: ClassesService,
    private toastr: ToastrService
  ) {
    this.loadClassModelTemplate();
  }

  ngOnInit() {
    if (!this.activatedRoute.snapshot.params['id'] && !this.router.url.includes('New')){
      this.router.navigateByUrl('/Classes');
      return;
    }

    if (this.router.url.includes('New')) {
      this.selectedClass = undefined;
      this.loadClassModelTemplate();
      return;
    }

    this.subscription =
      this.activatedRoute.params.subscribe(
        (params: any) => {
          if (this.router.url.includes('New'))
            return;

          if (!params['id']){
            this.router.navigateByUrl('/Classes');
            return;
          }

          this.id = params['id'];

          const existedClassModel = GlobalVariables.allClasses.find(classModel => classModel.id === this.id);

          if (!existedClassModel) {
            this.router.navigateByUrl('/Classes');
            return;
          }


          this.selectedClass =  existedClassModel;
          this.loadClassModelTemplate();
        }
      )
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onSubmit() {

    if(!this.classModel.name){
      this.toastr.warning('O campo nome deve ser preenchido');
      return;
    }

    if(this.classModel.clientsModel.length < 1){
      this.toastr.warning('Deve possuir pelo menos um cliente');
      return;
    }

    const apiModel = ClassesUtilities.convertFrontModelToApiModel(this.classModel);
    const apiCall = this.selectedClass? this.classesService.update(apiModel) :  this.classesService.register(apiModel);

    apiCall.subscribe({
      next: (value) => {
        this.successResponse(value);
      },
      error(err) {
        console.log(err)
      },
    })
  }

  loadClassModelTemplate() {
    if (!this.selectedClass){
      this.classModel = {
        name: '',
        clientsModel: [],
        clientsPresence: []
      }
    }
    else {
      this.classModel = ClassesUtilities.convertApiModelToFrontModel(this.selectedClass);
    }
  }

  successResponse(apiResponse: any) {
    if(!this.selectedClass)
      GlobalVariables.allClasses.push(apiResponse.data);
    else{
      const existedClass = GlobalVariables.allClasses.findIndex(p => p.id === apiResponse.data.id)!;
      GlobalVariables.allClasses[existedClass] = apiResponse.data;
    }

    this.router.navigateByUrl('/Classes');
  }

  formatIdNumber(numero: number): string {
    return numero.toLocaleString(undefined, {
      minimumIntegerDigits: 3,
      useGrouping: false
    });
  }
}
