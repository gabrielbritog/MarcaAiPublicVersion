import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/Helpers/GlobalVariables';
import { ClientModel } from '../../../../Models/ClientModel';
import { ClassesFrontModel, ClassesUtilities } from '../../../../Models/ClassesModel';
import { Router } from '@angular/router';
import { ClassesService } from '../../../../Services/api/Classes.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ClassDetails',
  templateUrl: './ClassDetails.component.html',
  styleUrls: ['../../../Styles/baseSection.scss', './ClassDetails.component.css']
})
export class ClassDetailsComponent implements OnInit {
  classModel: ClassesFrontModel;
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
      .sort((a, b) => {
        if (this.classModel.clientsModel.some(p => p.clientId === a.clientId))
          return -1;
        if (this.classModel.clientsModel.some(p => p.clientId === b.clientId))
          return 1;

        return 0;
      })
  }

  hasClient(client: ClientModel) {
    return this.classModel.clientsModel.some(p => p == client);
  }

  addClientToClass(client: ClientModel) {
    if (this.classModel.clientsModel.some(p => p == client))
      this.classModel.clientsModel = this.classModel.clientsModel.filter(p=> p !== client);
    else
      this.classModel.clientsModel.push(client);
  }

  constructor(
    private router: Router,
    private classesService: ClassesService,
    private toastr: ToastrService
  ) {
    if (!this.selectedClass){
      this.classModel = {
        name: 'Teste',
        clientsModel: [],
        clientsPresence: []
      }
    }
    else {
      this.classModel = ClassesUtilities.convertApiModelToFrontModel(this.selectedClass);
    }
  }

  ngOnInit() {
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

  successResponse(apiResponse: any) {
    if(!this.selectedClass)
      GlobalVariables.allClasses.push(apiResponse.data);
    else{
      const existedClass = GlobalVariables.allClasses.findIndex(p => p.id === apiResponse.data.id)!;
      GlobalVariables.allClasses[existedClass] = apiResponse.data;
    }

    this.router.navigateByUrl('/Classes');
  }

}
