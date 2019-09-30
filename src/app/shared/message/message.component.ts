import { Component, OnInit, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
     <div *ngIf='temErro()' class="ui-message ui-messages-error">
          {{ text }}
     </div>
  `,
  styles: [
      `
          .ui-message {
               background-color: rgba(138, 18, 74, 1);
               color: white;
               margin:4px 0  0 ;
               border-radius: 5px;
               transition: .5s;

          }
     `
  ]
})
export class MessageComponent{

     @Input()
     control: NgModel;
     @Input()
     text: string;
     @Input()
     error: string;

     temErro(): boolean{
     return this.control.hasError(this.error) && this.control.dirty;
}

}
