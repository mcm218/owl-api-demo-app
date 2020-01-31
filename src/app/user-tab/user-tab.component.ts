import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-user-tab",
  templateUrl: "./user-tab.component.html",
  styleUrls: ["./user-tab.component.css"]
})
export class UserTabComponent implements OnInit {
  user: any;
  constructor(private auth: AuthService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {}

  signOut() {
    this.auth.signOut();
  }
}
