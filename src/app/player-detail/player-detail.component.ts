import { Component, OnInit } from "@angular/core";
import { DbService, Team } from "../db.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-player-detail",
  templateUrl: "./player-detail.component.html",
  styleUrls: ["./player-detail.component.css"]
})
export class PlayerDetailComponent implements OnInit {
  id: string;
  player: any;
  team: Team;
  constructor(private dbService: DbService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.getPlayer();
    });
  }

  getPlayer() {
    // HTTP call to OWL API to get specific player information, then their team info
    this.playerSub = this.dbService.getPlayer(this.id).subscribe(player => {
      this.player = player.data.player;
      console.log(this.player);
      this.teamSub = this.dbService.getTeam(this.player.teams[0].team.id).subscribe(team => {
        this.team = team.data;
        console.log(this.team);
      });
    });
  }

  playerSub: Subscription;
  teamSub: Subscription;
  ngOnDestroy() {
    this.playerSub.unsubscribe();
    this.teamSub.unsubscribe();
  }
}
