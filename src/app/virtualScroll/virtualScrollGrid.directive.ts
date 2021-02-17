import { Directive, ElementRef, Inject, AfterViewInit, AfterContentChecked } from "@angular/core";

@Directive({
  selector: "[virtualScrollGrid]"
})
export class VirtualScrollGridDirective implements AfterContentChecked {
  constructor(
    @Inject(ElementRef) public elRef: ElementRef,
    @Inject("Window") private window: Window
  ) {}

  ngAfterContentChecked(): void {
    this.elRef.nativeElement.style.display = "grid";
    this.elRef.nativeElement.style.gap = "20px";
    this.elRef.nativeElement.style.marginBottom = "2rem";

    if (this.window.screen.availWidth < 576) {
      this.elRef.nativeElement.style.gridTemplateColumns = "100%";
    } else {
      const virtualScrollComponent = this.elRef.nativeElement.offsetParent
        .offsetParent.parentElement;
      const itemWidth = Number(
        virtualScrollComponent.getAttribute("ng-reflect-item-width")
      );

      this.elRef.nativeElement.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(" + itemWidth + "px, 1fr))";
    }
  }
}
