import { EventEmitterService } from './../../event-emitter.service';
import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { Lancamento } from './../../core/model';
import { HandleService } from './../../core/handle.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { PessoasService } from 'src/app/pessoas/pessoas.service';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent  implements OnInit{


    @ViewChild('ngF', {static: false}) form;
    ptBr: any;

     constructor(
          private categoriaService: CategoriasService,
          private handleService: HandleService,
          private pessoasService: PessoasService,
          private lancamentoService: LancamentoService,
          private toasty: ToastyService,
          private route: ActivatedRoute,
          private router: Router,
          private title: Title
          ){
              EventEmitterService.get('ativarEdicao').subscribe(objeto =>{
                  this.atualizarTituloEdicao();
                  this.carregarLancamento(objeto);
                });
                EventEmitterService.get('ativarNovo').subscribe(() => {
                    this.title.setTitle('Novo Lancamento');
                    this.novo(this.form);

                });

          }

     tipos = [
          { label: 'Receita', value: 'RECEITA' },
          { label: 'Despesa', value: 'DESPESA' },
        ];
        categorias = [ ];
        pessoas = [];
        lancamento = new Lancamento();


        ngOnInit() {



               this.carregarCategorias();
               this.carregarPessoas();

               this.ptBr = {
                firstDayOfWeek: 0,
                dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                monthNames: [ "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro" ],
                monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Otu", "Nov", "Dez" ],
                today: 'Hoje',
                clear: 'Limpar'
            };

        }

        ngOnDestroy() {
          EventEmitterService.get('ativarEdicao').subscribe(objeto => {
            this.carregarLancamento(objeto);
         }).unsubscribe();

         EventEmitterService.get('ativarNovo').subscribe(() => {
             this.novo(this.form);
           }).unsubscribe();
        }



        carregarLancamento(codigo: number){
               this.lancamentoService.buscarPorCodigo(codigo)
               .then(response => {
                    console.log(response);
                    this.lancamento =  response;
               })
               .catch(erro => this.handleService.handle(erro));
        }


        carregarCategorias() {
          this.categoriaService.listarCategorias()
            .then(categorias => {
              this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
            })
            .catch(erro => this.handleService.handle(erro));
        }


        carregarPessoas() {
          this.pessoasService.retornarPessoas()
            .then(pessoa => {
                 let valor = pessoa.content;
                 this.pessoas = valor.map(p => ({ label: p.nome, value: p.codigo }));
            })
            .catch(erro => this.handleService.handle(erro));
        }

        salvar(f: FormControl) {
             if (this.editando) {
                  this.atualizar(f);
             }else {
                  this.adicionarLancamento(f);
             }
          }

          adicionarLancamento(f: FormControl) {
               this.lancamentoService.adicionar(this.lancamento)
               .then(lancamentoAdicionado => {


               this.toasty.success('Lançamento adicionado com sucesso!');

               EventEmitterService.get('refreshTable').emit();
               EventEmitterService.get('fecharModal').emit();
             })
             .catch(erro => this.handleService.handle(erro));



          }

          atualizar(f: FormControl) {
               this.lancamentoService.atualizar(this.lancamento)
               .then(response => {
                    this.lancamento = response;
               this.toasty.success('Lancamento editado com sucesso!');
               EventEmitterService.get('refreshTable').emit();
               EventEmitterService.get('fecharModal').emit();

             })
             .catch(erro => {this.handleService.handle(erro); console.log(erro);});



          }

          get editando() {
                  return Boolean(this.lancamento.codigo);
             }


        novo(f: FormControl) {

          f.reset();

          setTimeout(function() {
               this.lancamento = new Lancamento();
          }.bind(this), 1);




        }

        atualizarTituloEdicao() {
             this.title.setTitle('Edição de lançamento: ' + this.lancamento.descricao);
        }
}
