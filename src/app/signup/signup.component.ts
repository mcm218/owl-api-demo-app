import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormBuilder } from "@angular/forms";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  faGoogle = faGoogle;
  signupForm;
  errorMessage: String;
  successMessage: String;
  users: any[];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    // Init signup form
    this.signupForm = this.formBuilder.group({
      username: "",
      email: "",
      password: "",
      confirm: ""
    });
    this.getUsernames();
  }

  ngOnInit() {}

  googleSignIn() {
    // Begins google sign in process
    this.authService.googleLogin().then(
      () => {
        this.errorMessage = "";
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }

  getUsernames() {
    // Firebase Cloudstore call to get all usernames
    this.authService.getUsernames().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as object)
        };
      });
    });
  }

  isUniqueUsername(username: string) {
    // Checks against database that username is unique
    for (let user of this.users) {
      if (username === user.username) {
        return false;
      }
    }
    return true;
  }

  trySignup(value) {
    // Attempts to signup user
    if (!this.isUniqueUsername(value.username)) {
      this.errorMessage = "Sorry, username is taken";
      return;
    }
    if (value.password !== value.confirm) {
      this.errorMessage = "Passwords don't match";
      return;
    }
    if (value.username === "") {
      this.errorMessage = "Please enter a username";
      return;
    }
    this.authService.trySignup(value).then(
      () => {
        this.errorMessage = "";
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }
}
