import { JwtHelperService } from '@auth0/angular-jwt';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from './../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { DataTableModule } from 'primeng/datatable';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './../app-routing-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { AuthGuard } from './auth.guard';




@NgModule({
  declarations: [LoginFormComponent],
  imports: [
     CommonModule,
     SegurancaRoutingModule,

     FormsModule,
     BrowserAnimationsModule,
     InputTextModule,
     ButtonModule,
     InputTextareaModule,
     CalendarModule,

     SharedModule,
     HttpClientModule
  ],
  providers: [AuthGuard]
})
export class SegurancaModule { }
