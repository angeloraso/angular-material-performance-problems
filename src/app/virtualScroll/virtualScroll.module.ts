import { CommonModule } from "@angular/common";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { VirtualScrollGridDirective } from "./virtualScrollGrid.directive";
import { VirtualScrollComponent } from "./virtualScroll.component";
import { NgModule } from "@angular/core";
import { VirtualForDirective } from "./virtualFor.directive";

@NgModule({
  imports: [CommonModule, ScrollingModule],
  declarations: [
    VirtualScrollComponent,
    VirtualScrollGridDirective,
    VirtualForDirective
  ],
  exports: [
    VirtualScrollComponent,
    VirtualScrollGridDirective,
    VirtualForDirective
  ]
})
export class VirtualScrollModule {}
