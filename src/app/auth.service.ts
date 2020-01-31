import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router
} from "@angular/router";
import { AngularFirestoreDocument } from "angularfire2/firestore";

interface User {
  uid: string;
  email: string;
  displayName: string;
}

export class dbUser {
  uid: string;
  email: string;
  username: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Observable<User>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    // Creates GoogleAuthProvider
    console.log("Attempting to login with Google...");
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    // Creates signIn popup for provider
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );

    const data: dbUser = {
      uid: user.uid,
      email: user.email,
      username: user.displayName
    };
    console.log("Logged in with Google!")
    return userRef.set(data, { merge: true });
  }

  trySignup(value): any {
    // Attempts to create user with provided email/password
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            res.user.updateProfile({ displayName: value.username });
            this.addUser(value.username);
            console.log("Signed up");
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  addUser(username) {
    // adds user to cloud firestore database
    let user = {
      uid: this.afAuth.auth.currentUser.uid,
      email: this.afAuth.auth.currentUser.email,
      username: username
    };
    this.firestore.collection("users").add(user);
  }
  usernames: any[];

  getUsernames(): Observable<any> {
    // retrieves all users found in cloud firestore
    return this.firestore.collection("users").snapshotChanges();
  }

  tryLogin(value): any {
    // Attempts to login user with provided email/password
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            console.log("Logged in");
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  signOut() {
    // Signs out current user
    this.afAuth.auth.signOut().then(() => {
      this.user = null;
      console.log("Logged out");
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    // Displays any errors that happen during HTTP calls
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
/*
 Used to ensure only authenticated users can reach certain pages
*/
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
    console.log("Auth Guard Constructed");
    this.authService.user.subscribe(user => {
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

  authenticated: boolean;

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.afAuth.auth.currentUser) {
      return true;
    } else {
      console.log("Access Denied");
      return false;
    }
  }
}
