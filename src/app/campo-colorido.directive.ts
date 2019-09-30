import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCampoColorido]',
  // Ele serve para exportar um elemento e assim será possível modificá-lo em outros elementos
  // Cria-se uma variável local -> #qualquerNome = 'campoColorido'
  exportAs: 'campoColorido'
})
export class CampoColoridoDirective {

     // constructor(
     //        private elementRef: ElementRef,
     //        private renderer: Renderer2
     //      ) { }

     @HostBinding('style.backgroundColor')

     corElemento: String;

    // hostListener('nomeDoEvento') -> serve para disparar o evento da diretiva
    @HostListener('focus')
     aoGanharFoco(){
          this.corElemento = 'rgba(0,0,0,.1)';


           // console.log(this.elementRef.nativeElement);
           // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'rgba(0,0,0,.1)');
     }

      @HostListener('blur')
      aoPerderFoco(){
          this.corElemento = "transparent";
           // console.log(this.elementRef.nativeElement);
           // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'transparent');

      }

}
