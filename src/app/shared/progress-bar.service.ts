import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

     constructor() { }

     private progressBar = new EventEmitter<boolean>();


     public showProgressBar(): void {
          this.progressBar.emit(true);
     }

     public hideProgressBar(): void {
          this.progressBar.emit(false);
     }



     public getObservable(): Observable<boolean> {
          return this.progressBar;
     }


}
