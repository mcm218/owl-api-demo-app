import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DbService, Team } from "../db.service";
import * as moment from "moment";

class DispMatch {
  match: any;
  teamA: Team;
  teamB: Team;
}
@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"]
})
export class ScheduleComponent implements OnInit {
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
  match;
  matches: any[];
  selectedTeam: number;
  teams: Team[];
  dispMatches: DispMatch[] = [];
  length: number = 10;
  constructor(private dbService: DbService) {
    // Init DataRangePicker
    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
  }

  ngOnInit() {
    this.getTeams();
  }

  filterMatches() {
    this.dispMatches = [];
    // Filters display matches first by daterange then by team
    for (var i = 0; i < this.matches.length; i++) {
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

    // Filter by DateRange
    this.dispMatches = this.dispMatches.filter(element => {
      if (this.selected.startDate) {
        return (
          element.match.actualStartDate > this.selected.startDate._d &&
          element.match.actualEndDate < this.selected.endDate._d
        );
      }
      return true;
    });

    // Filter by Team
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
      this.getSchedule();
    });
  }

  getSchedule(): void {
    // HTTP call to OWL API to get full season schedule
    this.scheduleSub = this.dbService.getSchedule().subscribe(matches => {
      this.matches = [];
      console.log(matches);
      for (var i = 0; i < 7; i++) {
        if (i == 2) {
          continue;
        }
        this.matches.push(...matches.data.stages[i].matches);
      }
      this.matches = this.matches.sort((a, b) => a.startDate - b.startDate);
      console.log(this.matches);
      // Adds length matches to be displayed
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
    // As user scrolls, adds more matches to be displayed
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

  scheduleSub: Subscription;
  teamSub: Subscription;

  ngOnDestroy() {
    this.scheduleSub.unsubscribe();
    this.teamSub.unsubscribe();
  }
}
