import { Component } from "@angular/core";
import { AuthGuard } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "The Overwatch League";
  authenticated: boolean;
  constructor(private authGuard: AuthGuard) {}
}
