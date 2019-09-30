import { HandleService } from './../handle.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/seguranca/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private auth: AuthService, private router: Router, private handle : HandleService){
       console.log(this.auth.isAccessTokenInvalid());
  }

  logout() {
       this.auth.logout()
       .then(() => {
            this.router.navigate(['/login']);
       })
       .catch(erro => {
            this.handle.handle('erro');
       });
  }



  menuMostrado = false;

  mostrarMenu(m : boolean){

    this.menuMostrado = m;

    if (this.menuMostrado === true){

      document.getElementById('toggle-item-menu').style.opacity = '1';
      document.getElementById('toggle-item-menu').style.right = '0';

    }else {
      document.getElementById('toggle-item-menu').style.opacity = '0';
      document.getElementById('toggle-item-menu').style.right = '-100px';
    }

  }

}
