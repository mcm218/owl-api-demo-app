import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { DbService, Team } from "../db.service";

@Component({
  selector: "app-projects",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"]
})
export class TeamsComponent implements OnInit {
  teams: Team[];

  constructor(private dbService: DbService) {}

  ngOnInit() {
    this.getTeams();
  }

  getTeams(): void {
    // HTTP call to OWL API to get all teams
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
