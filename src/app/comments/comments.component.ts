import { Component, OnInit } from "@angular/core";
import { DbService, Comment } from "../db.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"]
})
export class CommentsComponent implements OnInit {
  addCommentForm;
  path: string;
  comments: Comment[];
  authenticated: boolean;

  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    // Initiates comment form
    this.addCommentForm = this.formBuilder.group({
      comment: ""
    });
    // Subscribes to user to determine whether to show comment form
    this.authSub = this.authService.user.subscribe(user => {
      if (user) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }

      this.authService.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.authenticated = true;
        } else {
          this.authenticated = false;
        }
      });
    });
  }

  ngOnInit(): void {
    // Uses URL path to determine database comments location
    this.route.url.subscribe(url => {
      this.path = "";
      for (let segment of url) {
        this.path += "/" + segment.path;
      }
      console.log(this.path);
      this.getComments();
    });
  }

  getComments(): void {
    // Firebase Cloudstore call to grab all comments at path location
    this.commentsSub = this.dbService
      .getComments(this.path)
      .subscribe(comments => {
        this.comments = comments
          .map(comment => {
            return {
              id: comment.payload.doc.id,
              ...comment.payload.doc.data()
            } as Comment;
          })
          .sort((a, b) => b.date - a.date);
      });
  }

  addComment(value): void {
    // Firebase Cloudstore call to add comment
    value = value.trim();
    console.log(value);
    this.dbService.addComment(this.path, value);
    this.addCommentForm.reset();
  }

  commentsSub: Subscription;
  authSub: Subscription;
  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.commentsSub.unsubscribe();
  }
}
