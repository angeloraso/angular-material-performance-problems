import { Subscription } from 'rxjs';
import { Component, ContentChild, Input, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { VirtualForDirective } from './virtualFor.directive';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

interface WindowSize {
  height: number,
  width: number
}

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtualScroll.html'
})
export class VirtualScrollComponent implements AfterViewInit {
  @ContentChild(VirtualForDirective) virtualFor: VirtualForDirective;
  @ViewChild('virtualScroll', { static: false }) virtualScroll: CdkVirtualScrollViewport;
  @Input() itemHeight: number;
  @Input() itemWidth: number;
  @Input() viewPortHeight: number; // Pixels

  virtualScrollItems: Array<any>;
  itemsByRow: number;
  items: Array<any>;
  virtualScrollHeight: string;

  readonly windowSizeChanged = new BehaviorSubject<WindowSize>(<WindowSize>{
    width: this.window.innerWidth,
    height: this.window.innerHeight
  });

  private subscription = new Subscription();

  constructor(@Inject("Window") private window: Window) {
    fromEvent(window, 'resize').pipe(
      debounceTime(200),
      map((event: any) => <WindowSize>{
        width: event.currentTarget.innerWidth,
        height: event.currentTarget.innerHeight
      }))
      .subscribe(windowSize => {
        this.windowSizeChanged.next(windowSize);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const height = this.viewPortHeight ?? this.window.screen.availHeight;
      this.virtualScrollHeight = height + 'px';
      this.subscription.add(this.virtualFor.items.subscribe(items => {
        if (items) {
          this.items = items;
          if (this.itemsByRow) {
            this.fillVirtualScroll();
          }
        }
      }));
  
      this.subscription.add(this.windowSizeChanged.asObservable().subscribe(_ => {
        this.setItemsByRow();
      }));
    }, 100);
  }

  setItemsByRow() {
    // Get the component width
    const virtualScrollWidth = this.virtualScroll.elementRef.nativeElement.offsetWidth;
    const itemsByRow = Number((virtualScrollWidth / this.itemWidth).toFixed(2));
    const trunc = Math.trunc(itemsByRow);
    const decimal = itemsByRow - trunc;
    // Multiply by 20 to consider the grid gap
    if ((this.itemWidth * decimal) < (trunc * 20)) {
      this.itemsByRow = trunc - 1;
    } else {
      this.itemsByRow = trunc;
    }

    if (this.items) {
      this.fillVirtualScroll();
    }
  }

  fillVirtualScroll() {
    const array: any = [];
    const itemsLenght = this.items.length;
    let i;
    for (i = 0; i < itemsLenght; i++) {
      array.push(this.items.slice(i, i + this.itemsByRow));
      i += this.itemsByRow - 1;
    }

    this.virtualScrollItems = array;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
