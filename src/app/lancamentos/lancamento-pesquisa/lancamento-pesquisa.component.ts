import { PessoasService } from './../../pessoas/pessoas.service';
import { Pessoa } from 'src/app/core/model';
import { Lancamento } from './../../core/model';
import { EventEmitterService } from './../../event-emitter.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { HandleService } from './../../core/handle.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
  lancamentos = [];
  paginaAtual = 0;
  display: boolean;
  filtroDisplay: boolean;
  @Input() valor;
  @Input() pessoa;
  @Input() dataPagamento;
  display2: boolean;
  pessoas = [];

  @ViewChild('tabela', { static: false }) // ----> para pegar valor do p-dataTable
  grid;
  ptBr: any;
  exp: string;
  lancamentosExportados = [];
  constructor(
    private lancamentoService: LancamentoService,
    private pessoaService: PessoasService,
    private toastyService: ToastyService,
    private confirmService: ConfirmationService,
    private handleService: HandleService,
    private title: Title,
    private auth: AuthService
  ) {
    EventEmitterService.get('refreshTable').subscribe(() => {
      this.title.setTitle('Pesquisa de Lancamentos');
      this.pesquisar();
    });
    EventEmitterService.get('fecharModal').subscribe(() => {
      this.display = false;
    });



  }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Lancamentos');

    this.carregarPessoas();
    this.carregarCalendario();
  }

  carregarCalendario() {
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

  pesquisarComFiltroAvancado() {
    this.filtroDisplay = false;
    this.pesquisar();
  }
  carregarPessoas() {
    this.pessoaService.retornarPessoas()
      .then(pessoa => {
           let valor = pessoa.content;
           this.pessoas = valor.map(p => ({ label: p.nome, value: p.nome }));
      })
      .catch(erro => this.handleService.handle(erro));
  }

  limparBusca(f: FormControl) {

    if (f.dirty) {

      f.reset();
      this.lancamentoFiltro = new LancamentoFiltro();
    }
    this.pesquisar();
  }

  limparFiltro() {
    this.pessoa = '';
    this.valor = '';
    this.dataPagamento = '';
  }

  pesquisar(pagina = 0) {
    this.lancamentoFiltro.paginacao = pagina;
    this.lancamentoService.pesquisar(this.lancamentoFiltro, this.pessoa, this.valor, this.dataPagamento)
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

  confirmarExclusao(lancamento: any, f: FormControl) {
    this.confirmService.confirm({
      message: 'Você tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento, f);
      }
    });
  }

  excluir(lancamento: any, f: FormControl) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.temRegistroNaPagina(this.paginaAtual);
        f.reset();
        this.pesquisar(0);
        this.toastyService.success('Apagado com Sucesso!');


        // tslint:disable-next-line: max-line-length
        // this.grid.first = 0; --> Volta para a primeira página, e por isso ele ativa o aoMudarPagina(), para usar cria-se uma variável loca
      })
      .catch(error => this.handleService.handle(error));
  }

  temRegistroNaPagina(pagina: number) {
    // Faz com que volte para a primeira
    if (this.totalDeElementosNaPagina === 1) {
      if (pagina != 0) {
        this.grid.first = 0;
      }
    }

  }


  adicionarNovaPessoa() {
    this.display = true;
    EventEmitterService.get('ativarNovo').emit(true);
  }


  ativarEdicao(objeto: Lancamento) {
    this.display = true;
    EventEmitterService.get('ativarEdicao').emit(objeto.codigo);
  }

  atualizarTituloEdicao() {
    this.title.setTitle('Pesquisa de Lancamentos');
  }


  // Exportação para XLSX
  pegaTudo() {

    this.lancamentoService.pegaTudo(this.lancamentoFiltro)
      .then(resultado => {

        this.lancamentosExportados = [];
        for (let result of resultado) {
          if (result.dataVencimento[1] < 10) {
            result.dataVencimento[1] = `0${result.dataVencimento[1]}`;
          }
          if (result.dataVencimento[2] < 10) {
            result.dataVencimento[2] = `0${result.dataVencimento[2]}`;
          }
          if (result.dataPagamento) {
            if (result.dataPagamento[1] < 10) {
              result.dataPagamento[1] = `0${result.dataPagamento[1]}`;
            }
            if (result.dataPagamento[2] < 10) {
              result.dataPagamento[2] = `0${result.dataPagamento[2]}`;
            }
          }
          this.lancamentosExportados.push({
            'Código': result.codigo,
            'Descrição': result.descricao,
            'Data de Vencimento': `${result.dataVencimento[2]}/${result.dataVencimento[1]}/${result.dataVencimento[0]}`,
            'Data de Pagamento': result.dataPagamento ? `${result.dataPagamento[2]}/${result.dataPagamento[1]}/${result.dataPagamento[0]}` : '',
            'Valor': result.valor,
            'Tipo': result.tipo

          });
        }
      }).catch(erro => console.log(erro));
  }

  exportAsXLSX(form: FormControl) {
    this.lancamentoService.exportToExcel(this.lancamentosExportados, this.exp);
    form.reset();
    this.display2 = false;
  }


}
