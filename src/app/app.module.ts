import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "angularfire2";
import {
  FontAwesomeModule,
  FaIconLibrary
} from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { HomeComponent } from "./home/home.component";
import { TeamsComponent } from "./teams/teams.component";
import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { TeamDetailComponent } from "./team-detail/team-detail.component";
import { PlayersComponent } from "./players/players.component";
import { SafePipe } from "./safe.pipe";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatchesComponent } from "./matches/matches.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { CommentsComponent } from "./comments/comments.component";
import { MatchDetailComponent } from "./match-detail/match-detail.component";
import { SignupComponent } from "./signup/signup.component";
import { UserTabComponent } from "./user-tab/user-tab.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMenuModule } from "@angular/material/menu";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PlayerDetailComponent } from './player-detail/player-detail.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      TeamsComponent,
      LoginComponent,
      HeaderComponent,
      FooterComponent,
      TeamDetailComponent,
      PlayersComponent,
      SafePipe,
      MatchesComponent,
      ScheduleComponent,
      CommentsComponent,
      MatchDetailComponent,
      SignupComponent,
      UserTabComponent,
      PlayerDetailComponent
   ],
   imports: [
      NgxDaterangepickerMd.forRoot(),
      MatMenuModule,
      MatFormFieldModule,
      MatSelectModule,
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      FontAwesomeModule,
      ScrollingModule,
      InfiniteScrollModule,
      BrowserAnimationsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
