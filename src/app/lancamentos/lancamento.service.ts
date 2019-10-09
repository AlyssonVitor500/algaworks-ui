import { environment } from './../../environments/environment';
import { Lancamento } from './../core/model';
import { HandleService } from './../core/handle.service';

import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { AuthService } from '../seguranca/auth.service';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export class LancamentoFiltro {

     paginacao = 0;
     numeroPorPaginas = 5;
     descricao: string;
     dataVencimentoInicio: Date;
     dataVencimentoFim: Date;
     totalItens: 15;

}

const EXCEL_TYPE =
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;';
const EXCEL_EXT = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {



     lancamentosUrl: string;

     constructor(private http: HttpClient, private auth: AuthService) {

          this.lancamentosUrl = ` ${environment.apiUrl}/lancamentos`;
      }

      headers = new HttpHeaders({
          'Content-Type':  'application/json'
          // Authorization: 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='

     });





     pesquisar(filtro: LancamentoFiltro): Promise<any> {
          this.renovarAccessToken();


          let params = new HttpParams();

          params = params.set('page', filtro.paginacao.toString());
          params = params.set('size', filtro.numeroPorPaginas.toString());


          if ( filtro.descricao ) {
               params = params.set('descricao', filtro.descricao);
          }

          if ( filtro.dataVencimentoFim ) {
               params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
          }

          if ( filtro.dataVencimentoInicio ) {
               params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
          }








          return this.http.get(`${this.lancamentosUrl}?resumo`, {params})
       .toPromise()
       .then(response => {

               return response;
       });

     }

     excluir(codigo: number): Promise<void> {
          this.renovarAccessToken();
          return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
          .toPromise()
          .then(() => null);
     }

     adicionar(lancamento: Lancamento): Promise<any> {
          this.renovarAccessToken();

          return this.http.post(this.lancamentosUrl,
              JSON.stringify(lancamento), {headers: this.headers})
            .toPromise()
          .then(response => response);
        }


     atualizar(lancamento: Lancamento): Promise<Lancamento> {
          this.renovarAccessToken();

          return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`,
              JSON.stringify(lancamento), {headers: this.headers})
            .toPromise()
            .then(response => {
              const lancamentoAlterado = response as Lancamento;

              this.converterStringsParaDatas([lancamentoAlterado]);

              return lancamentoAlterado;
            });
        }

     buscarPorCodigo(codigo: number): Promise<Lancamento> {
          this.renovarAccessToken();

          return this.http.get(`${this.lancamentosUrl}/${codigo}`)
            .toPromise()
            .then(response => {
              const lancamento = response as Lancamento;

              this.converterStringsParaDatas([lancamento]);

              return lancamento;
            });
        }

     private converterStringsParaDatas(lancamentos: Lancamento[]) {
          this.renovarAccessToken();

          for (const lancamento of lancamentos) {
            lancamento.dataVencimento = moment(lancamento.dataVencimento,
              'YYYY-MM-DD').toDate();

            if (lancamento.dataPagamento) {
              lancamento.dataPagamento = moment(lancamento.dataPagamento,
                'YYYY-MM-DD').toDate();
            }
          }
        }

     renovarAccessToken() {
          if (this.auth.isAccessTokenInvalid()) {
               this.auth.obterNovoAcessToken();
          }
     }


     exportToExcel(json: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = {
      Sheets: {data: worksheet},
      SheetNames: ['data']
      };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Chama o metodo buffer eo nome do arquivo
      this.saveAsExcel(excelBuffer, excelFileName);
    }

    private saveAsExcel(buffer: any, fileName: any): void {
      const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
      FileSaver.saveAs(data, fileName + EXCEL_EXT);
    }

    pegaTudo(filtro: LancamentoFiltro): Promise<any> {
        let params = new HttpParams();


        if ( filtro.descricao ) {
        params = params.set('descricao', filtro.descricao);
      }

        if ( filtro.dataVencimentoFim ) {
          params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
      }

        if ( filtro.dataVencimentoInicio ) {
          params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
      }



        return this.http.get(`${this.lancamentosUrl}?resumoParaExportar`,
          {  params })
          .toPromise()
          .then(response => {

          const lancamentos = response;
          // console.log(lancamentos);


          return lancamentos;
        });


    }



}

