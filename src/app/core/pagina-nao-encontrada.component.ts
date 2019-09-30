import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-nao-encontrada',
  template: `

          <img class="img-fluid mx-auto d-block" src="/assets/erro404.jpg" alt="">
  `,
  styles: [
       `
          img {
               height: 90vh;
          }
       `
  ]
})
export class PaginaNaoEncontradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
