import { AppRoutingModule } from './app-routing-module';

import { CoreModule } from './core/core.module';
import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { CampoColoridoDirective } from './campo-colorido.directive';
import { RouterModule, Routes } from '@angular/router';
import { PessoaPesquisaComponent } from './pessoas/pessoa-pesquisa/pessoa-pesquisa.component';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { CommonModule } from '@angular/common';
import { EventEmitterService } from './event-emitter.service';





@NgModule({
  declarations: [
    AppComponent,
    CampoColoridoDirective

  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    CoreModule,

    AppRoutingModule


  ],
  providers: [ EventEmitterService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
