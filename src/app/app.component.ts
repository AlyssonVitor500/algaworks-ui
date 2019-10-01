import { ProgressBarService } from './shared/progress-bar.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

     showProgressBar: boolean;

     constructor(
          private toastyConfig: ToastyConfig,
          private router: Router,
          private progressBarService: ProgressBarService
     )  {
          this.toastyConfig.theme = 'bootstrap';
          this.showProgressBar = false;
          this.progressBarService.getObservable()
            .subscribe(show => this.showProgressBar = show);

     }

     exibindoNavbar() {

          return (this.router.url !== '/login');
        }


}
