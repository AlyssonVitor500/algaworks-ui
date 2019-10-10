import { EventEmitterService } from './../../event-emitter.service';
import { AuthService } from 'src/app/seguranca/auth.service';

import { FormControl } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { HandleService } from './../../core/handle.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { PessoaFilter } from './../pessoas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoasService } from '../pessoas.service';
import { ToastyService } from 'ng2-toasty';
import { Title } from '@angular/platform-browser';
import { Pessoa } from 'src/app/core/model';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit{

     constructor(
          private pessoaService: PessoasService,
          private toastyService: ToastyService,
          private handleService: HandleService,
          private confirmation: ConfirmationService,
          private title: Title,
          private auth: AuthService
     ) {

      EventEmitterService.get('refresh').subscribe(() => {
        this.display = false;
        this.title.setTitle("Listagem de Pessoas");
        this.pesquisarPessoa();
      });

     }

     total = 0;
     filtro = new PessoaFilter();
     pessoas = [];
     @ViewChild('tabela', {static: false})
     tabela;
     display: boolean;
     display2: boolean;
     exp: string;
     pessoasExportadas;

     ngOnInit() {
          this.title.setTitle('Listagem de Pessoas');
     }

     limparBusca(f: FormControl){

          if (f.dirty){

               f.reset();
               this.filtro = new  PessoaFilter();
               this.pesquisarPessoa();
          }

     }

     pesquisarPessoa(pagina = 0){
          this.filtro.pagina = pagina;
          this.pessoaService.pesquisar(this.filtro)
          .then(pessoa => {
               this.pessoas = pessoa.content;
               this.total = pessoa.totalElements;
               this.title.setTitle("Listagem de Pessoas");
          });
     }

     aoMudarPagina(event: LazyLoadEvent){
         const pagina = (event.first / event.rows);
         this.filtro.pagina = pagina;
         this.pesquisarPessoa(pagina);
     }


     verificacaoExcluisao(pessoa){
          this.confirmation.confirm({
               message: 'Deseja apagar o registro de pessoas?',
               accept: () => {
                    this.excluirPessoa(pessoa);
               }
          });
     }


     excluirPessoa(pessoa: any){
          this.pessoaService.excluir(pessoa.codigo)
          .then(() => {
               this.verificaPaginaAposAlteracao();
               this.toastyService.success('Pessoa apagada com sucesso!');
          })
          .catch(error => this.handleService.handle(error));
     }

     alterarAtivo(pessoa: any) {
          this.pessoaService.alterarAtivo(pessoa)
          .then(() => {
               this.verificaPaginaAposAlteracao();
               this.toastyService.success('Status alterado com sucesso');
          })
          .catch(erro => this.handleService.handle(erro));
     }


     verificaPaginaAposAlteracao() {
          if (!(this.tabela.first === 0)) {
               this.tabela.first = 0;
          } else {
               this.pesquisarPessoa();
          }
     }

     adicionarNovo(){
        this.display = true;
        EventEmitterService.get('cadastrarPessoa').emit();
     }

     editar(pessoa: Pessoa){
        this.display = true;
        EventEmitterService.get('editarPessoa').emit(pessoa);
     }


      // Exportação para XLSX

      pegaTudo() {

          this.pessoaService.pegaTudo(this.filtro)
            .then(resultado => {

              this.pessoasExportadas = [];
              for (let result of resultado){

                    this.pessoasExportadas.push({
                        'Código': result.codigo,
                        'Estado': result.endereco.estado,
                        'Cidade': result.endereco.cidade,
                        'Bairro': result.endereco.bairro,
                        'Logradouro': result.endereco.logradouro,
                        'Número': result.endereco.numero,
                        'Complemento': result.endereco.complemento,
                        'Status': result.ativo ? 'Ativo' : 'Inativo'
                    });
              }



            }).catch(erro => console.log(erro));
        }

        exportAsXLSX( form : FormControl ) {

            this.pessoaService.exportToExcel(this.pessoasExportadas, this.exp);
            form.reset();
            this.display2 = false;
        }

        atualizarTituloEdicao(form? : FormControl){

          this.title.setTitle('Listagem de Pessoas');
          if (form){
            form.reset();
          }

        }

}
