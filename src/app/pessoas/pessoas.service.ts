import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../core/model';
import { AuthService } from '../seguranca/auth.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


export class PessoaFilter {
  nome: string;
  pagina = 0;
  numeroPorPagina = 5;
}

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;';
const EXCEL_EXT = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class PessoasService {

  origem: string


  headers = new HttpHeaders({
    'Content-Type': 'application/json'
    // ,Authorization: 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
  });

  constructor(private http: HttpClient, private auth: AuthService) {
    this.origem = ` ${environment.apiUrl}/pessoa`;
  }

  pesquisar(filtro: PessoaFilter, cidade, estado, ativo): Promise<any> {
    this.renovarAccessToken();

    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.numeroPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }
    if (cidade) {
      params = params.set('cidade', cidade);
    }
    if (estado) {
      params = params.set('estado', estado);
    }
    if (ativo) {
      params = params.set('ativo', ativo);
    }


    return this.http.get(this.origem, { params })
      .toPromise()
      .then(response => response);
  }
  retornarPessoas(): Promise<any> {
    this.renovarAccessToken();
    return this.http.get(this.origem)
      .toPromise()
      .then(response => response);
  }

  excluir(codigo: number): Promise<void> {
    this.renovarAccessToken();
    return this.http.delete(`${this.origem}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  alterarAtivo(pessoa: any): Promise<void> {


    this.renovarAccessToken();

    return this.http.put(`${this.origem}/${pessoa.codigo}/ativo`, !pessoa.ativo, { headers: this.headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<any> {
    this.renovarAccessToken();

    return this.http.post(this.origem, JSON.stringify(pessoa), { headers: this.headers })
      .toPromise()
      .then(response => {
        const pessoa = response as Pessoa;
        return pessoa;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    this.renovarAccessToken();
    return this.http.get(`${this.origem}/${codigo}`)
      .toPromise()
      .then(response => {
        const pessoa = response as Pessoa;
        return pessoa;
      });
  }

  atualizar(pessoa: Pessoa) {
    this.renovarAccessToken();
    return this.http.put(`${this.origem}/${pessoa.codigo}`, JSON.stringify(pessoa), { headers: this.headers })
      .toPromise()
      .then(response => {
        return response as Pessoa;
      });
  }

  renovarAccessToken() {
    if (this.auth.isAccessTokenInvalid()) {
      this.auth.obterNovoAcessToken();



    }
  }

  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Chama o metodo buffer eo nome do arquivo
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, fileName: any): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXT);
  }

  pegaTudo(filtro: PessoaFilter): Promise<any> {
    this.renovarAccessToken();

    let params = new HttpParams();

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }


    return this.http.get(`${this.origem}?paraExportar`, { params })
      .toPromise()
      .then(response => response);
  }
}
