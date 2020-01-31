import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { TeamsComponent } from "./teams/teams.component";
import { LoginComponent } from "./login/login.component";

import { AuthGuard } from "./auth.service";
import { TeamDetailComponent } from "./team-detail/team-detail.component";
import { PlayersComponent } from "./players/players.component";
import { MatchesComponent } from "./matches/matches.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { MatchDetailComponent } from "./match-detail/match-detail.component";
import { PlayerDetailComponent } from "./player-detail/player-detail.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "teams", component: TeamsComponent },
  { path: "players", component: PlayersComponent },
  { path: "schedule", component: ScheduleComponent },
  { path: "matches", component: MatchesComponent },
  { path: "login", component: LoginComponent },
  { path: "teams/:id", component: TeamDetailComponent },
  { path: "players/:id", component: PlayerDetailComponent },
  { path: "matches/:id", component: MatchDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
