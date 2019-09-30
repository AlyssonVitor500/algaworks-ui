import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { Lancamento } from './../../core/model';
import { HandleService } from './../../core/handle.service';
import { Component, OnInit } from '@angular/core';
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

     constructor(
          private categoriaService: CategoriasService,
          private handleService: HandleService,
          private pessoasService: PessoasService,
          private lancamentoService: LancamentoService,
          private toasty: ToastyService,
          private route: ActivatedRoute,
          private router: Router,
          private title: Title
          ){}

     tipos = [
          { label: 'Receita', value: 'RECEITA' },
          { label: 'Despesa', value: 'DESPESA' },
        ];
        categorias = [ ];
        pessoas = [];
        lancamento = new Lancamento();


        ngOnInit() {
               // Pega o Path :codigo
               const codigoLancamento = this.route.snapshot.params['codigo'];

               if (codigoLancamento) {
                 this.carregarLancamento(codigoLancamento);
               }

               this.title.setTitle('Novo Lancamento');




               this.carregarCategorias();
               this.carregarPessoas();

        }




        carregarLancamento(codigo: number){
               this.lancamentoService.buscarPorCodigo(this.route.snapshot.params['codigo'])
               .then(response => {
                    this.lancamento =  response;
                    this.atualizarTituloEdicao();
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
                    this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);

               this.toasty.success('Lançamento adicionado com sucesso!');
             })
             .catch(erro => this.handleService.handle(erro));



          }

          atualizar(f: FormControl) {
               this.lancamentoService.atualizar(this.lancamento)
               .then(response => {
                    this.lancamento = response;
                    this.atualizarTituloEdicao();
               this.toasty.success('Lancamento editado com sucesso!');
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


          this.router.navigate(['/lancamentos/novo']);
        }

        atualizarTituloEdicao() {
             this.title.setTitle('Edição de lançamento: ' + this.lancamento.descricao);
        }
}
