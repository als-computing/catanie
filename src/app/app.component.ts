import { APP_CONFIG, AppConfig } from "./app-config.module";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { LoopBackConfig } from "shared/sdk";
import * as ua from "state-management/actions/user.actions";
import { MatSnackBar } from "@angular/material";
import { Meta } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { Subscription } from "rxjs";

const { version: appVersion } = require("../../package.json");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, OnInit {
  facility: string;
  appVersion: number;
  userMessageSubscription: Subscription;

  constructor(
    private metaService: Meta,
    public snackBar: MatSnackBar,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store<any>
  ) {
    this.appVersion = appVersion;
    this.facility = this.appConfig.facility;
    this.metaService.addTag({
      name: "description",
      content: "SciCat metadata catalogue at" + this.facility
    });
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */
  ngOnInit() {
    LoopBackConfig.setBaseURL(environment.lbBaseURL);
    console.log(LoopBackConfig.getPath());
    if ("lbApiVersion" in environment) {
      const lbApiVersion = environment["lbApiVersion"];
      LoopBackConfig.setApiVersion(lbApiVersion);
    }

    if (window.location.pathname.indexOf("logout") !== -1) {
      this.logout();
    }

    this.userMessageSubscription = this.store
      .pipe(select(state => state.root.user.message))
      .subscribe(current => {
        if (current.content !== undefined) {
          this.snackBar.open(current.content, undefined, {
            duration: current.duration
          });
          this.store.dispatch(new ua.ClearMessageAction());
        }
      });
  }

  ngOnDestroy() {
    this.userMessageSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(new ua.LogoutAction());
  }
}
