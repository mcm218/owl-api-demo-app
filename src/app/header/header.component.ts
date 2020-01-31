import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { DbService, Team } from "../db.service";
import { faUser } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  faUser = faUser;
  teams: Team[];
  authenticated: boolean;

  constructor(private authService: AuthService, private dbService: DbService) {
    // Subscribes to user to check if user is authenticated or not for displaying login/signup or user profile
    this.subscription = this.authService.user.subscribe(user => {
      if (user) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }

      this.authService.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.authenticated = true;
        } else {
          this.authenticated = false;
        }
      });
    });
  }

  signOut() {
    this.authService.signOut();
  }

  ngOnInit() {
    this.getTeams();
  }

  getTeams(): void {
    // HTTP call to OWL API to get all teams for TEAMS dropdown
    this.subscription = this.dbService.getTeams().subscribe(teams => {
      this.teams = teams.data;
      this.teams.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      console.log(teams);
    });
  }

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
