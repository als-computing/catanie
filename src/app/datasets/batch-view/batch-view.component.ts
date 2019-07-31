import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { first, map, switchMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  ClearBatchAction,
  PrefillBatchAction,
  RemoveFromBatchAction
} from "state-management/actions/datasets.actions";
import { Dataset, MessageType } from "state-management/models";
import { ShowMessageAction } from "state-management/actions/user.actions";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable } from "rxjs";
import { ShareGroupApi } from "shared/sdk/services/custom/ShareGroup";
import { ShareGroupInterface, ShareGroup } from "shared/sdk/models/ShareGroup";

import { ActionsSubject } from "@ngrx/store";

import { ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";


export interface Share {
  name: string;
}
@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"]
})
export class BatchViewComponent implements OnInit {

  @ViewChild("secondDialog", {static: true}) secondDialog: TemplateRef<any>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  shareEmails: Share[] = [];
  datasetList = [];

  private visibleColumns: [string, string, string, string] = [
    "remove",
    "pid",
    "sourceFolder",
    "creationTime"
  ];

  private batch$: Observable<Dataset[]> = this.store.pipe(
    select(getDatasetsInBatch)
  );
  public hasBatch$: Observable<boolean> = this.batch$.pipe(
    map(batch => batch.length > 0)
  );
  subsc = null;

  constructor(
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    private router: Router,
    private shareGroupApi: ShareGroupApi,
    private dialog: MatDialog
    // private actionsSubj: ActionsSubject
  ) {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.shareEmails.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Share): void {
    const index = this.shareEmails.indexOf(fruit);

    if (index >= 0) {
      this.shareEmails.splice(index, 1);
    }
  }

  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog);
  }

  ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
    this.batch$
    .subscribe(result => {
      this.datasetList = result;
    });
  }

  onEmpty() {
    const msg =
      "Are you sure that you want to remove all datasets from the batch?";
    if (confirm(msg)) {
      this.clearBatch();
    }
  }

  onRemove(dataset: Dataset) {
    this.store.dispatch(new RemoveFromBatchAction(dataset));
  }

  onPublish() {
    this.router.navigate(["datasets", "batch", "publish"]);
  }

  onShare() {
    console.log("", this.shareEmails)
    const myShare = new ShareGroup;
    myShare.datasets = this.datasetList.map(dataset => dataset.pid);
    myShare.members = this.shareEmails.map(share => share.name);
    this.shareGroupApi.upsert(myShare)
    .subscribe(result => {
      this.store.dispatch(
        new ShowMessageAction({
          type: MessageType.Success,
          content: "Publication Successful" ,
          duration: 5000
        })
      );
    });

  }

  onArchive() {
    this.batch$
      .pipe(
        first(),
        switchMap(datasets => this.archivingSrv.archive(datasets))
      )
      .subscribe(
        () => this.clearBatch(),
        err =>
          this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message,
              duration: 5000
            })
          )
      );
  }

  onRetrieve() {
    this.batch$
      .pipe( first(), switchMap(datasets =>
          this.archivingSrv.retrieve(datasets, "/archive/retrieve")
        ) )
      .subscribe(() => this.clearBatch(), err => this.store.dispatch(new ShowMessageAction(
              {
                type: MessageType.Error,
                content: err.message,
                duration: 5000
              }
            )));
  }

  private clearBatch() {
    this.store.dispatch(new ClearBatchAction());
  }
}
