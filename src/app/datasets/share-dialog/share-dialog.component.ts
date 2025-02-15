import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { UserIdentity, UserIdentityApi } from "shared/sdk";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.scss"],
})
export class ShareDialogComponent {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  users: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    public store: Store,
    public userIdentityApi: UserIdentityApi
  ) {}

  isInvalid = (): boolean =>
    this.emailFormControl.hasError("email") ||
    this.emailFormControl.hasError("required");

  add = async (email: string): Promise<void> => {
    try {
      await this.userIdentityApi
        .findOne<UserIdentity>({ where: { "profile.email": email.trim() } })
        .toPromise();
      this.users.push(email.trim());
      this.emailFormControl.reset();
    } catch (error) {
      const message = new Message(
        "The email address is not connected to a SciCat user",
        MessageType.Error,
        5000
      );
      this.store.dispatch(showMessageAction({ message }));
    }
  };

  remove = (email: string): void => {
    const index = this.users.indexOf(email);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  };

  isEmpty = (): boolean => this.users.length === 0;

  share = (): void => this.dialogRef.close({ users: this.users });

  cancel = (): void => this.dialogRef.close();
}
