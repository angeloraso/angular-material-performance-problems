import { Directive, Input, TemplateRef, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[virtualFor]'
})

export class VirtualForDirective {
  public _items = new BehaviorSubject<any[]>([]);

  get items() {
    return this._items.asObservable();
  }

  @Input()
  set virtualForIn(items: any) {
    this._items.next(items);
  }

  constructor(@Inject(TemplateRef) public template: TemplateRef<any>) {}
}
