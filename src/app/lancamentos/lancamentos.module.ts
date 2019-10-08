import { AppModule } from './../app.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentoPesquisaComponent } from './lancamento-pesquisa/lancamento-pesquisa.component';

import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { DataTableModule } from 'primeng/datatable';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SharedModule } from '../shared/shared.module';
import { LancamentosRoutingModule } from './lancamentos-routing.module';



@NgModule({
  declarations: [
     LancamentoCadastroComponent,
     LancamentoPesquisaComponent
  ],
  imports: [
     CommonModule,
     FormsModule,

     InputTextModule,
     ButtonModule,
     DataTableModule,
     TooltipModule,
     InputTextareaModule,
     CalendarModule,
     SelectButtonModule,
     DropdownModule,
     CurrencyMaskModule,

     SharedModule,
     LancamentosRoutingModule,
     DialogModule


   ],

   exports: [ ]
 })
 export class LancamentosModule { }
