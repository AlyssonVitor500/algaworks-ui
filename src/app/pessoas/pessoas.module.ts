import { HttpClientModule } from '@angular/common/http';
import { PessoaPesquisaComponent } from './pessoa-pesquisa/pessoa-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataTableModule } from 'primeng/datatable';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import {RadioButtonModule} from 'primeng/radiobutton';

import { PessoasRoutingModule } from './pessoas-routing.module';
import { DialogModule } from 'primeng/dialog';



@NgModule({
  declarations: [
          PessoaCadastroComponent,
          PessoaPesquisaComponent
     ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    InputMaskModule,
    SharedModule,
    HttpClientModule,
    PessoasRoutingModule,
    DialogModule,
    RadioButtonModule
  ],
  exports: [  ]
})
export class PessoasModule { }
