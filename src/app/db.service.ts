import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { AngularFirestore } from "angularfire2/firestore";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { TeamsComponent } from "./teams/teams.component";
import { AuthService } from "./auth.service";
import { environment } from 'src/environments/environment';

export interface Project {
  message: string;
  imageUrl: string;
}
export interface Team {
  abbreviatedName: string;
  accounts: any[];
  colors: any;
  divisionId: number;
  handle: string;
  hasFallback: boolean;
  id: number;
  location: string;
  logo: any;
  name: string;
  players: Player[];
  website: string;
}

export interface Player {
  accounts: any[];
  flags: any[];
  fullName: string;
  handle: string;
  headshot: string;
  homeLocation: string;
  id: number;
  name: string;
  number: number;
  role: string;
}

export class Comment {
  username: string;
  uid: string;
  comment: string;
  datetime: string;
}

@Injectable({
  providedIn: "root"
})
export class DbService {
  private items: Observable<any[]>;
  private playersUrl = "https://api.overwatchleague.com/players";
  private teamsUrl = "https://api.overwatchleague.com/v2/teams";
  private matchesUrl = "https://api.overwatchleague.com/matches";
  private scheduleUrl = "https://api.overwatchleague.com/schedule";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  private vodsUrl = "https://api.overwatchleague.com/vods";
  private youtubeUrl =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UUiAInBL9kUzz1XRxk66v-gw&key=" +
    environment.youtubeKey;

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  getTeams(): Observable<any> {
    // HTTP call to OWL API to get all teams
    return this.http.get<any>(this.teamsUrl).pipe(
      tap(_ => console.log("Found teams")),
      catchError(this.handleError<any[]>("getTeams", []))
    );
  }

  getTeam(id): Observable<any> {
    // HTTP call to OWL API to get specific team
    return this.http.get<any>(this.teamsUrl + "/" + id).pipe(
      tap(_ => console.log("Found team")),
      catchError(this.handleError<any[]>("getTeam", []))
    );
  }

  getPlayers(): Observable<any> {
    // HTTP call to OWL API to get all players
    return this.http.get<any>(this.playersUrl).pipe(
      tap(_ => console.log("Found players")),
      catchError(this.handleError<any[]>("getPlayers", []))
    );
  }

  getPlayer(id): Observable<any> {
    // HTTP call to OWL API to get specific player
    return this.http.get<any>(this.playersUrl + "/" + id).pipe(
      tap(_ => console.log("Found player")),
      catchError(this.handleError<any[]>("getPlayer", []))
    );
  }

  getComments(path): Observable<any> {
    // Cloud firestore call to get all comments at path location
    return this.firestore.collection("comments" + path).snapshotChanges();
  }

  addComment(path: string, c: string) {
    // Cloud firestore call to add comment to path location
    let uid = this.authService.afAuth.auth.currentUser.uid;
    let username = this.authService.afAuth.auth.currentUser.displayName;
    if (username === "") {
      username = this.authService.afAuth.auth.currentUser.email;
    }
    let comment = {
      username: username,
      uid: uid,
      comment: c,
      date: Date.now()
    };
    this.firestore.collection("comments" + path).add(comment);
  }

  getSchedule(): Observable<any> {
    // HTTP call to OWL API to get full season schedule
    return this.http.get<any>(this.scheduleUrl).pipe(
      tap(_ => console.log("Found schedule")),
      catchError(this.handleError<any[]>("getSchedule", []))
    );
  }

  getAllMatches(page?, size?): Observable<any> {
    // HTTP call to OWL API to get size matches at page from matches list
    if (size) {
      return this.http
        .get<any>(
          this.matchesUrl + "?season=2019&size=" + size + "&page=" + page
        )
        .pipe(
          tap(_ => console.log("Found all matches")),
          catchError(this.handleError<any[]>("getAllMatches", []))
        );
    }
    // HTTP call to OWL API to get all matches
    return this.http.get<any>(this.matchesUrl).pipe(
      tap(_ => console.log("Found all matches")),
      catchError(this.handleError<any[]>("getAllMatches", []))
    );
  }

  getMatch(id): Observable<any> {
    // HTTP call to OWL API to get specific match
    return this.http.get<any>(this.matchesUrl + "/" + id).pipe(
      tap(_ => console.log("Found match")),
      catchError(this.handleError<any[]>("getMatch", []))
    );
  }

  getVods(): Observable<any> {
    // HTTP call to Youtube API to get all videos from OWL channel
    return this.http.get<any>(this.youtubeUrl).pipe(
      tap(_ => console.log("Found VODs")),
      catchError(this.handleError<any[]>("getVods", []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
