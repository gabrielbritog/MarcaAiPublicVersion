import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeComponent } from './Pages/Admin/EmployeesPage/EditEmployee/EditEmployee.component';
import { EmployeesPageComponent } from './Pages/Admin/EmployeesPage/EmployeesPage.component';
import { ListEmployeeComponent } from './Pages/Admin/EmployeesPage/ListEmployee/ListEmployee.component';
import { NewEmployeeComponent } from './Pages/Admin/EmployeesPage/NewEmployee/NewEmployee.component';
import { LoginPageComponent } from './Pages/Auth/LoginPage/LoginPage.component';
import { RegisterPageComponent } from './Pages/Auth/RegisterPage/RegisterPage.component';
import { AccountPageComponent } from './Pages/Shared/AccountPage/AccountPage.component';
import { EditEmailComponent } from './Pages/Shared/AccountPage/EditEmail/EditEmail.component';
import { EditNameComponent } from './Pages/Shared/AccountPage/EditName/EditName.component';
import { EditPasswordComponent } from './Pages/Shared/AccountPage/EditPassword/EditPassword.component';
import { EditPhoneComponent } from './Pages/Shared/AccountPage/EditPhone/EditPhone.component';
import { UserInfoComponent } from './Pages/Shared/AccountPage/UserInfo/UserInfo.component';
import { ClientsPageComponent } from './Pages/Shared/ClientsPage/ClientsPage.component';
import { ListClientsComponent } from './Pages/Shared/ClientsPage/ListClients/ListClients.component';
import { HomePageComponent } from './Pages/Shared/HomePage/HomePage.component';
import { EditServiceComponent } from './Pages/Shared/ServicesPage/EditService/EditService.component';
import { ListServiceComponent } from './Pages/Shared/ServicesPage/ListService/ListService.component';
import { NewServiceComponent } from './Pages/Shared/ServicesPage/NewService/NewService.component';
import { ServicesPageComponent } from './Pages/Shared/ServicesPage/ServicesPage.component';
import { WorkFlowPageComponent } from './Pages/Shared/WorkFlowPage/WorkFlowPage.component';
import { DashboardSectionComponent } from './Pages/Shared/DashboardPage/DashboardSection.component';
import { SchedulesSectionComponent } from './Pages/Shared/SchedulesPage/SchedulesSection.component';
import { HistoryPage } from './Pages/Shared/HistoryPage/HistorySection.component';
import { ScheduleListComponent } from './Pages/Shared/SchedulesPage/schedule-list/schedule-list.component';
import { ScheduleDetailsComponent } from './Pages/Shared/SchedulesPage/schedule-details/schedule-details.component';
import { ClassesPageComponent } from './Pages/Shared/ClassesPage/ClassesPage.component';
import { ClassesListComponent } from './Pages/Shared/ClassesPage/ClassesList/ClassesList.component';
import { ClassDetailsComponent } from './Pages/Shared/ClassesPage/ClassDetails/ClassDetails.component';
import { NewClientComponent } from './Pages/Shared/ClientsPage/NewClient/NewClient.component';
import { EditClientComponent } from './Pages/Shared/ClientsPage/EditClient/EditClient.component';
import { SchedulePresenceComponent } from './Pages/Shared/SchedulesPage/schedule-presence/schedule-presence.component';

const routes: Routes = [
  { path: 'Login', component: LoginPageComponent },
  { path: 'Register', component: RegisterPageComponent },
  { path: 'Home', component: HomePageComponent },
  { path: 'Dashboard', component: DashboardSectionComponent },
  { path: 'Schedules', component: SchedulesSectionComponent , children: [
    {path: '', component: ScheduleListComponent},
    {path: 'Presence/:id', component: SchedulePresenceComponent},
    {path: 'Details', component: ScheduleDetailsComponent},
    {path: 'New', component: ScheduleDetailsComponent},
  ] },
  { path: 'History', component: HistoryPage },
  { path: 'WorkFlow', component: WorkFlowPageComponent },
  { path: 'Employees', component: EmployeesPageComponent , children: [
    {path: '', component: ListEmployeeComponent},
    {path: 'Edit', component: EditEmployeeComponent},
    {path: 'New', component: NewEmployeeComponent},
  ] },
  { path: 'Services', component: ServicesPageComponent , children: [
    {path: '', component: ListServiceComponent},
    {path: 'Edit', component: EditServiceComponent},
    {path: 'New', component: NewServiceComponent},
  ] },
  {
    path: 'Clients', component: ClientsPageComponent, children: [
    {path: '', component: ListClientsComponent},
    {path: 'New', component: NewClientComponent},
    {path: 'Edit/:id', component: EditClientComponent},
  ] },
  { path: 'Classes', component: ClassesPageComponent, children: [
    {path: '', component: ClassesListComponent},
    {path: 'Details', component: ClassDetailsComponent},
    {path: 'New', component: ClassDetailsComponent},
  ] },
  { path: 'Account', component: AccountPageComponent, children: [
    {path: '', component: UserInfoComponent},
    {path: 'Name', component: EditNameComponent},
    {path: 'Email', component: EditEmailComponent},
    {path: 'Phone', component: EditPhoneComponent},
    {path: 'Password', component: EditPasswordComponent},
  ] },
  { path: '', redirectTo: '/Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
