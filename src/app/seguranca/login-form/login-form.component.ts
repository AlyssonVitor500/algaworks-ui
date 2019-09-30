import { Router } from '@angular/router';
import { HandleService } from './../../core/handle.service';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
       private auth: AuthService,
       private errorHandler: HandleService,
       private router: Router
     ) { }

  ngOnInit() {
  }


     entrar(email: string, senha: string) {

          this.auth.entrar(email, senha);

     }

}
