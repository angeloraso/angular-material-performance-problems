import { DOCUMENT } from '@angular/common';
import { Directive, Input, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle: string = '';
  tooltip: HTMLElement | null;
  hiding: boolean;

  constructor(
    @Inject(ElementRef) private elRef: ElementRef,
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject('Window') private window: Window) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) {
      this.hiding = false;
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip && !this.hiding) {
      this.hiding = true;
      this.hide();
    }
  }

  @HostListener('click') onClick() {
    if (this.tooltip && !this.hiding) {
      this.hiding = true;
      this.hide();
    }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'tooltip-identify');
    this.renderer.addClass(this.tooltip, 'tooltip--show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'tooltip--show');
    this.tooltip = null;
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );

    this.renderer.appendChild(this.document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'tooltip');
    this.renderer.addClass(this.tooltip, 'tooltip-top');
  }

  setPosition() {
    const elRefPosition = this.elRef.nativeElement.getBoundingClientRect();

    const tooltipPos = this.tooltip?.getBoundingClientRect();

    const scrollPos = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    let top = elRefPosition.top - tooltipPos.height - 10;
    let left = elRefPosition.left + ((elRefPosition.width - tooltipPos.width) / 2);

    this.renderer.setStyle(this.tooltip, 'top', (top + scrollPos) + 'px');
    this.renderer.setStyle(this.tooltip, 'left', left + 'px');
  }
}
