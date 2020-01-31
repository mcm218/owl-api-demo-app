import { Component, OnInit } from "@angular/core";
import { DbService } from "../db.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bio",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
/*
  ToDo:
  Fix Bug -
    Load Home
    Move to Teams
    Return to Home - Video autoplays
*/
export class HomeComponent implements OnInit {
  constructor(private dbService: DbService) {}

  vods: any[];
  dispVods: any[] = [];
  length: number = 5;

  ngOnInit() {
    this.getVods();
  }

  getVods() {
    // HTTP call to Youtube API to get all videos from OWL channel
    // formats them to dispVods to contain embed URL and video description
    this.subscription = this.dbService.getVods().subscribe(vods => {
      console.log(vods);
      this.vods = vods.items;
      for (var i = 0; i < 5; i++) {
        this.dispVods.push({
          url:
            "https://www.youtube.com/embed/" +
            this.vods[i].snippet.resourceId.videoId,
          description: this.vods[i].snippet.description
        });
      }
    });
  }

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onScroll() {
    // As user scrolls down page, push more videos to dispVods
    this.dispVods.push({
      url:
        "http://www.youtube.com/embed/" +
        this.vods[length].snippet.resourceId.videoId,
      description: this.vods[length].snippet.description
    });
    length += 1;
  }
}
