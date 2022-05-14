import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit {
  profileData: any;
  profileData2: any;
  hide = true;
  selectedFile: any;
  changeEditProfile: boolean;
  changePass = false;

  constructor(
    private _userService: UserService,
    private _messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.profileData = {};
    this.profileData2 = {};
    this.selectedFile = null;
    this.changeEditProfile = true;
  }

  ngOnInit(): void {
    this._userService.profile().subscribe({
      next: (v) => {
        this.profileData = v.userById;
      },
      error: (e) => {
        console.log(e.error.message);
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

  editProfile(profileDatas:any) {
    this.profileData2 =  profileDatas;
    this.changeEditProfile = false;
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  changeAvatar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: 'Avatar', action: 'Change' };

    this.dialog
      .open(DialogContentCheckComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            const data = new FormData();
            if (this.selectedFile != null) {
              data.append('image', this.selectedFile, this.selectedFile.name);
              this._userService.profileImg(data).subscribe({
                next: (v) => {
                  this.profileData.profileImg = v.imageUrl;
                  localStorage.setItem('imgProfile', v.imageUrl);
                  this._messageService.openSnackBarSuccesfull('Avatar update');
                },
                error: (e) => {
                  this._messageService.openSnackBarError(e.error.message);
                },
                complete: () => console.info('complete'),
              });
            } else {
              this._messageService.openSnackBarError('Please select an image');
            }
          }
        },
      });
  }

  changeProfile() {
    if (this.changePass) {
      if (
        !this.profileData.passwordConfir ||
        !this.profileData.passwordEdit ||
        !this.profileData.passwordOld
      ) {
        this._messageService.openSnackBarError(
          'Failed process: Imcomplete data'
        );
      } else {
        if (this.profileData.passwordConfir === this.profileData.passwordEdit) {
          this._userService.profilePassword(this.profileData).subscribe({
            next: (v) => {
              this._messageService.openSnackBarSuccesfull(v.message);
              this.changePass = false;
              this.changeEditProfile = true;
            },
            error: (e) => {
              this._messageService.openSnackBarError(e.error.message);
            },
            complete: () => console.info('complete'),
          });
        } else this._messageService.openSnackBarError('Passwords do not match');
      }
    } else {
      if (!this.profileData.name || !this.profileData.email) {
        this._messageService.openSnackBarError(
          'Failed process: Imcomplete data'
        );
      } else {
          this._userService.updateUserProfile(this.profileData).subscribe({
            next: (v) => {
              this._messageService.openSnackBarSuccesfull(v.message);
              this.changeEditProfile = true;
            },
            error: (e) => {
              this.ngOnInit();
              this._messageService.openSnackBarError(e.error.message);
            },
            complete: () => console.info('complete'),
          });
      }
    }
  }

  editPassword() {
    this.changePass = true;
    this.changeEditProfile = false;
  }

  cancelUpdate() {
    this.ngOnInit();
    this.changePass = false;
    this.changeEditProfile = true;
  }
}
