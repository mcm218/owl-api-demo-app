import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DbService } from "../db.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-team-detail",
  templateUrl: "./team-detail.component.html",
  styleUrls: ["./team-detail.component.css"]
})
/*
  ToDo:
  Bug - If list isn't long enough for scrollbar, onScroll() is never called
*/
export class TeamDetailComponent implements OnInit {
  id: string;
  team: any;
  matches: any[];
  allMatches: any[];
  length: number;
  pageLen: number = 20;
  curPage: number;

  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Subscribes to route path to change data if user views diff team w/o leaving page
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.getTeam();
    });
  }
  getTeam(): void {
    // HTTP call to OWL API to get specific team
    this.teamSub = this.dbService.getTeam(this.id).subscribe(team => {
      this.length = 20;
      this.curPage = 1;
      this.team = team.data;
      console.log(team);
      this.getMatches();
    });
  }

  getMatches(): void {
    // HTTP call to OWL API to get all matches, paginated
    this.matchesSub = this.dbService
      .getAllMatches(this.curPage, this.pageLen)
      .subscribe(matches => {
        this.matches = [];
        this.allMatches = [];
        this.allMatches.push(...matches.content);
        console.log(matches);
        let len =
          this.pageLen > matches.content.length
            ? matches.content.length
            : this.pageLen;
        for (var i = 0; i < len; i++) {
          if (
            this.allMatches[i].competitors[0].id.toString() == this.id ||
            this.allMatches[i].competitors[1].id.toString() == this.id
          ) {
            this.matches.push(this.allMatches[i]);
          }
        }
        console.log(this.matches);
        for (var i = 0; i < 5; i++) {
          this.onScroll();
        }
      });
  }

  onScroll() {
    // As user scrolls, adds pushes more matches to display
    this.curPage++;
    this.matchesSub = this.dbService
      .getAllMatches(this.curPage, this.pageLen)
      .subscribe(matches => {
        this.allMatches.push(...matches.content);
        console.log(this.allMatches);
        let len =
          this.pageLen > matches.content.length
            ? matches.content.length
            : this.pageLen;
        for (var i = 0; i < len; i++) {
          if (
            this.allMatches[this.length].competitors[0].id.toString() ==
              this.id ||
            this.allMatches[this.length].competitors[1].id.toString() == this.id
          ) {
            this.matches.push(this.allMatches[this.length]);
          }
          this.length++;
        }
      });
  }
  goBack(): void {
    // Returns user to team page
    this.location.back();
  }

  teamSub: Subscription;
  matchesSub: Subscription;
  ngOnDestroy() {
    this.teamSub.unsubscribe();
    this.matchesSub.unsubscribe();
  }
}
