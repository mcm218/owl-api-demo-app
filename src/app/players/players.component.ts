import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { DbService, Team, Player } from "../db.service";
/*
ToDo:
  Add search bar for finding specific players
  * should remove teams AND players as search gets more specific
*/
@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.css"]
})
export class PlayersComponent implements OnInit {
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
      for (let team of this.teams) {
        team.players.sort((a, b) => {
          return a.number - b.number;
        });
      }
      console.log(teams);
    });
  }

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
