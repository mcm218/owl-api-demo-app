import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export class value {
  email: String;
  password: String;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  faGoogle = faGoogle;
  loginForm;
  errorMessage: String;
  successMessage: String;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    // Initiate login form
    this.loginForm = this.formBuilder.group({
      email: "",
      password: ""
    });
  }

  ngOnInit() {}

  // Calls to authService to begin Google sign in process
  googleSignIn() {
    this.authService.googleLogin().then(
      () => {
        this.errorMessage = "";
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }

  // Attempts to login using email/password values provided
  tryLogin(value) {
    this.authService.tryLogin(value).then(
      () => {
        this.errorMessage = "";
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }
}
