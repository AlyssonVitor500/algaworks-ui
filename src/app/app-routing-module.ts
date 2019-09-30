import { NaoAutorizadoComponent } from './core/nao-autorizado/nao-autorizado.component';
import { LancamentoPesquisaComponent } from './lancamentos/lancamento-pesquisa/lancamento-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamentos/lancamento-cadastro/lancamento-cadastro.component';
import { PessoaPesquisaComponent } from './pessoas/pessoa-pesquisa/pessoa-pesquisa.component';
import { PessoaCadastroComponent } from './pessoas/pessoa-cadastro/pessoa-cadastro.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';



const rotas: Routes = [

     {
          path: '',
          redirectTo: 'lancamentos',
          pathMatch: 'full'
     },
     {
          path: 'pagina-nao-autorizada',
          component: NaoAutorizadoComponent
     },
     {
          path: 'pagina-nao-encontrada',
          component: PaginaNaoEncontradaComponent
     },
     {
          path: '**',
          redirectTo: 'pagina-nao-encontrada',
          pathMatch: 'full'
     }



];


@NgModule({
     imports: [
       RouterModule.forRoot(rotas)

     ],
     exports: [
          RouterModule
     ]
   })

   export class AppRoutingModule { }
