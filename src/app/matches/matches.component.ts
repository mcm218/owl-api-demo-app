import { Component, OnInit } from "@angular/core";
import { DbService, Team } from "../db.service";
import { Subscription } from "rxjs";
import * as moment from "moment";
/*
  ToDo:
    Add search bar
    Multiple seasons
*/
class DispMatch {
  match: any;
  teamA: Team;
  teamB: Team;
}
@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"]
})
export class MatchesComponent implements OnInit {
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment()
        .subtract(1, "month")
        .startOf("month"),
      moment()
        .subtract(1, "month")
        .endOf("month")
    ],
    "Last 3 Month": [
      moment()
        .subtract(3, "month")
        .startOf("month"),
      moment()
        .subtract(1, "month")
        .endOf("month")
    ]
  };
  matches: any[];
  teams: Team[];
  selectedTeam: number;
  dispMatches: DispMatch[] = [];
  length: number = 10;
  pageLen: number = 20;
  curPage: number = 1;
  constructor(private dbService: DbService) {
    // Initialize DateRangePicker
    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
  }

  ngOnInit() {
    this.getTeams();
  }

  filterMatches() {
    // Filters dispMatches first by dateRange then by team
    this.dispMatches = [];
    for (var i = 0; i < this.matches.length; i++) {
      let dispMatch = new DispMatch();
      dispMatch.match = this.matches[i];
      // Determine teams in match
      for (let team of this.teams) {
        if (team.id == this.matches[i].competitors[0].id) {
          dispMatch.teamA = team;
        }
      }
      for (let team of this.teams) {
        if (team.id == this.matches[i].competitors[1].id) {
          dispMatch.teamB = team;
        }
      }
      this.dispMatches.push(dispMatch);
    }
    this.dispMatches.sort((a, b) => {
      return b.match.startDate - a.match.startDate;
    });

    // DateRange Filter
    this.dispMatches = this.dispMatches.filter(element => {
      if (this.selected.startDate) {
        return (
          element.match.actualStartDate > this.selected.startDate._d &&
          element.match.actualEndDate < this.selected.endDate._d
        );
      }
      return true;
    });

    // Team Filter
    this.dispMatches = this.dispMatches.filter(element => {
      if (this.selectedTeam) {
        return (
          element.teamA.id == this.selectedTeam ||
          element.teamB.id == this.selectedTeam
        );
      }
      return true;
    });
  }

  getTeams(): void {
    // HTTP call to OWL API to get all teams
    this.teamSub = this.dbService.getTeams().subscribe(teams => {
      this.teams = teams.data;
      this.teams.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      console.log(teams);
      this.getMatches();
    });
  }

  getMatches(): void {
    // HTTP call to OWL API to get all matches, splits into 30 API calls for faster page loading
    this.matchSub = this.dbService
      .getAllMatches(this.curPage, this.pageLen)
      .subscribe(matches => {
        this.matches = matches.content;
        console.log(this.matches);
        for (var i = 0; i < 29; i++) {
          this.continueLoading();
        }
      });
  }

  continueLoading() {
    if (!this.matches) {
      return;
    }
    this.curPage++;
    // More calls for OWL API matches
    this.matchSub = this.dbService
      .getAllMatches(this.curPage, this.pageLen)
      .subscribe(matches => {
        this.matches.push(...matches.content);
        this.matches.sort((a, b) => {
          return b.startDate - a.startDate;
        });
        // Adds matches as found to dispMatches array
        this.dispMatches = [];
        for (var i = 0; i < this.length; i++) {
          let dispMatch = new DispMatch();
          dispMatch.match = this.matches[i];
          for (let team of this.teams) {
            if (team.id == this.matches[i].competitors[0].id) {
              dispMatch.teamA = team;
            }
          }
          for (let team of this.teams) {
            if (team.id == this.matches[i].competitors[1].id) {
              dispMatch.teamB = team;
            }
          }
          this.dispMatches.push(dispMatch);
        }
      });
  }

  onScroll() {
    // As user scrolls down, adds more matches to be displayed
    if (!this.matches) {
      return;
    }
    for (var i = 0; i < 10; i++) {
      if (this.length >= this.matches.length) {
        return;
      }
      let dispMatch = new DispMatch();
      dispMatch.match = this.matches[this.length];
      for (let team of this.teams) {
        if (team.id == this.matches[this.length].competitors[0].id) {
          dispMatch.teamA = team;
        }
      }
      for (let team of this.teams) {
        if (team.id == this.matches[this.length].competitors[1].id) {
          dispMatch.teamB = team;
        }
      }
      this.dispMatches.push(dispMatch);
      this.length++;
    }
  }

  matchSub: Subscription;
  teamSub: Subscription;

  ngOnDestroy() {
    this.matchSub.unsubscribe();
    this.teamSub.unsubscribe();
  }
}
