import { AuthService } from 'src/app/seguranca/auth.service';
import { FormControl } from '@angular/forms';
import { HandleService } from './../../core/handle.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Header } from 'primeng/components/common/shared';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/api';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-lancamento-pesquisa',
  templateUrl: './lancamento-pesquisa.component.html',
  styleUrls: ['./lancamento-pesquisa.component.css']
})

export class LancamentoPesquisaComponent implements OnInit {

     totalDeElementosNaPagina;
     lancamentoFiltro = new LancamentoFiltro();
     totalDeElementos = 0;
     voltaParaPagina = this.totalDeElementosNaPagina - 1;
     lancamentos = [  ];
     paginaAtual = 0;

     @ViewChild('tabela', {static: false}) //----> para pegar valor do p-dataTable
      grid;


     constructor(
          private lancamentoService: LancamentoService,
          private toastyService: ToastyService,
          private confirmService: ConfirmationService,
          private handleService: HandleService,
          private title: Title,
          private auth: AuthService
     ) { }

     ngOnInit() {
          this.title.setTitle('Pesquisa de Lancamentos');
     }

     limparBusca(f: FormControl){

          if (f.dirty){

               f.reset();
               this.lancamentoFiltro = new  LancamentoFiltro();
               this.pesquisar();
          }

     }

     pesquisar(pagina = 0) {
          this.lancamentoFiltro.paginacao = pagina;
          this.lancamentoService.pesquisar(this.lancamentoFiltro)
          //   content: pega os os valores que estao dentro do array
          .then(resposta => {

               this.lancamentos = resposta.content;
               this.totalDeElementos = resposta.totalElements;
               this.totalDeElementosNaPagina = resposta.numberOfElements;


          })
          .catch(error => this.handleService.handle(error));


     }

     aoMudarPagina(event: LazyLoadEvent) {
          this.paginaAtual = event.first / event.rows;
          this.pesquisar(this.paginaAtual);
     }

     confirmarExclusao(lancamento: any){
          this.confirmService.confirm({
               message: 'Você tem certeza que deseja excluir?',
               accept: () => {
                    this.excluir(lancamento);
               }
          });
     }

     excluir(lancamento: any){

          this.lancamentoService.excluir(lancamento.codigo)
          .then(() => {
                this.temRegistroNaPagina(this.paginaAtual);
                this.pesquisar(this.paginaAtual);
                this.toastyService.success('Apagado com Sucesso!');


               // this.grid.first = 0; --> Volta para a primeira página, e por isso ele ativa o aoMudarPagina(), para usar cria-se uma variável loca
          })
          .catch(error => this.handleService.handle(error));


     }

     temRegistroNaPagina(pagina: number){
          // Faz com que volte para a primeira
          if (this.totalDeElementosNaPagina === 1) {
                if (pagina != 0) {
                    this.grid.first = 0;
                }
           }

     }

}
