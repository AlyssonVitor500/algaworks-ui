import { Title } from '@angular/platform-browser';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HandleService } from './../../core/handle.service';
import { Pessoa } from './../../core/model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoasService } from '../pessoas.service';
import { ToastyService } from 'ng2-toasty';
import { EventEmitterService } from './../../event-emitter.service';
import { format } from 'url';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit  {

    @ViewChild('ngF', {static: false}) form;

     pessoa = new Pessoa();

     constructor(
       private pessoaService: PessoasService,
       private toasty: ToastyService,
       private handler: HandleService,
       private router: Router,
       private route: ActivatedRoute,
       private title: Title
     ) {

        EventEmitterService.get('cadastrarPessoa').subscribe(() => {
            this.novo(this.form);
        });
        EventEmitterService.get('editarPessoa').subscribe(response => {
          this.buscarPessoa(response.codigo);
      });

     }

     ngOnInit() {
          const codigoParams = this.route.snapshot.params['codigo'];

          if(codigoParams) {
               this.buscarPessoa(codigoParams);
          }

          this.title.setTitle('Criação de Pessoa');
     }


     ngOnDestroy(){
        EventEmitterService.get('adicionarPessoa').unsubscribe();

     }


     get isEditado()  {
          return Boolean(this.pessoa.codigo);
     }


     buscarPessoa(codigo: number) {
          this.pessoaService.buscarPorCodigo(codigo)
          .then(pessoaResgatada => {
                    this.pessoa = pessoaResgatada;
                    this.title.setTitle('Edição de Pessoa: ' + pessoaResgatada.nome);
               })
               .catch(erro => {
                    this.handler.handle(erro);
                    this.router.navigate(['/pessoas']);
               });
     }

     salvar(form: FormControl) {
          if (this.isEditado) {
               this.atualizar(form);
          }else {
               this.cadastrar(form);
          }
     }


     cadastrar(form: FormControl){

          this.pessoaService.adicionar(this.pessoa)
            .then(response => {
              this.toasty.success('Pessoa adicionada com sucesso!');
              form.reset();

              EventEmitterService.get('refresh').emit();
            })
            .catch(erro => {
                 this.handler.handle(erro);

               });
     }
     atualizar(form: FormControl){

          this.pessoaService.atualizar(this.pessoa)
          .then(response => {
               this.toasty.success('Pessoa atualizada com sucesso!');
               EventEmitterService.get('refresh').emit();

               this.buscarPessoa(response.codigo);

          })
           .catch(erro => this.handler.handle(erro));
     }

     novo(form: FormControl) {
               form.reset();
               this.pessoa = new Pessoa();

     }
}


