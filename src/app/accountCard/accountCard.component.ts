import { Component, Input } from "@angular/core";

@Component({
  selector: "account-card",
  templateUrl: "./accountCard.html",
  styleUrls: ["./accountCard.css"]
})
export class AccountCardComponent {
  @Input() account: any;
}
