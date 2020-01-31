import { Component, OnInit } from "@angular/core";
import { DbService, Team } from "../db.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-match-detail",
  templateUrl: "./match-detail.component.html",
  styleUrls: ["./match-detail.component.css"]
})
export class MatchDetailComponent implements OnInit {
  id: string;
  teams: Team[];
  match: any;

  constructor(private dbService: DbService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.getMatch();
    });
  }
  getTeams(): void {
    // HTTP call to OWL API to get all teams, pushes teams found in match to be displayed
    this.teamsSub = this.dbService.getTeams().subscribe(teams => {
      let i = 0;
      this.teams = [];
      while (teams.data[i].id != this.match.competitors[0].id) {
        i++;
      }
      this.teams.push(teams.data[i]);
      i = 0;
      while (teams.data[i].id != this.match.competitors[1].id) {
        i++;
      }
      this.teams.push(teams.data[i]);
      console.log(this.teams);
    });
  }

  getMatch(): void {
    // HTTP call to OWL API to get specific match
    this.matchSub = this.dbService.getMatch(this.id).subscribe(match => {
      this.match = match;
      console.log(match);
      this.getTeams();
    });
  }

  teamsSub: Subscription;
  matchSub: Subscription;
  ngOnDestroy() {
    this.teamsSub.unsubscribe();
    this.matchSub.unsubscribe();
  }
}
