import { RouterModule } from '@angular/router';
import { CategoriasService } from './../categorias/categorias.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpClientModule } from '@angular/common/http';
import { ToastyModule } from 'ng2-toasty';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { PessoasService } from './../pessoas/pessoas.service';
import { ConfirmationService } from 'primeng/api';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandleService } from './handle.service';
import { PessoasModule } from '../pessoas/pessoas.module';
import { LancamentosModule } from '../lancamentos/lancamentos.module';
import { SharedModule } from 'primeng/components/common/shared';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { Title } from '@angular/platform-browser';
import { SegurancaModule } from '../seguranca/seguranca.module';
import { AuthService } from '../seguranca/auth.service';


import { InterceptorModule } from '../seguranca/interceptor.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';



@NgModule({
  declarations: [NavbarComponent, PaginaNaoEncontradaComponent, NaoAutorizadoComponent],
  imports: [
    CommonModule,

    HttpClientModule,
    ToastyModule.forRoot(),
    ConfirmDialogModule,
    PessoasModule,
    LancamentosModule,
    SharedModule,
    RouterModule,
    SegurancaModule,
   InterceptorModule


  ],
  exports: [
     NavbarComponent,
     HttpClientModule,
     ToastyModule,
     ConfirmDialogModule,
     PessoasModule,
     LancamentosModule,
     SharedModule
],
  providers:[
     LancamentoService,
     PessoasService,
     HandleService,
     ConfirmationService,
     CategoriasService,
     Title,
     AuthService
  ]
})
export class CoreModule { }
