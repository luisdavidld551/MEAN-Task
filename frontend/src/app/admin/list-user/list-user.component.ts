import { OnInit, Component, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
  userData: any;
  displayedColumns: string[] = [
    'NAME',
    'PHONE',
    'EMAIL',
    'ROLE',
    'STATUS',
    'ACTIONS',
  ];
  name: string = '';
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
    private _userService: UserService,
    private _messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.userData = {};
    this.dataSource = new MatTableDataSource(this.userData);
  }

  ngOnInit(): void {
    this._userService.getuserAdmin('').subscribe({
      next: (v: any) => {
        this.userData = v.userList;
        this.dataSource = new MatTableDataSource(this.userData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (e) => {
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

  openDialog() {
    this.dialog
      .open(RegisterUserComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v != undefined) {
            if (!v.name || !v.email || !v.phone || !v.password || !v.role) {
              this._messageService.openSnackBarError(
                'Failed process: Imcomplete data'
              );
            } else {
              this._userService.registerUserAdmin(v).subscribe({
                next: (v) => {
                  this.userData.push(v.userAdmin);
                  this._messageService.openSnackBarSuccesfull(
                    'Successfull user registration'
                  );
                  this.dataSource = new MatTableDataSource(this.userData);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                },
                error: (e) => {
                  this._messageService.openSnackBarError(e.error.message);
                },
                complete: () => console.info('complete'),
              });
            }
          }
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogUpdate(dataUser: any) {
    dataUser.password = '';
    this.dialog
      .open(UpdateUserComponent, {
        data: dataUser,
      })
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v != undefined) {
            if (!v.name || !v.email || !v.phone || !v.role) {
              this._messageService.openSnackBarError(
                'Failed process: Imcomplete data'
              );
            } else {
              this._userService.updateUserId(v).subscribe({
                next: (v) => {
                  this.ngOnInit();
                  this._messageService.openSnackBarSuccesfull(
                    'Successful user update'
                  );
                },
                error: (e) => {
                  this._messageService.openSnackBarError(e.error.message);
                },
                complete: () => console.info('complete'),
              });
            }
          } else{
            this.ngOnInit();
          }
        },
      });
  }

  deleteUser(user: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: 'User', action: 'Delete' };
    this.dialog
      .open(DialogContentCheckComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            this._userService.deleteUserId(user).subscribe({
              next: (v) => {
                let index = this.userData.indexOf(user);
                if (index > -1) {
                  user.dbStatus = false;
                  this.userData[index] = user;
                  this.dataSource = new MatTableDataSource(this.userData);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              },
              error: (e) => {
                this._messageService.openSnackBarError(e.error.message);
              },
              complete: () => console.info('complete'),
            });
          }
        },
      });
  }

  activeUser(user: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: 'User', action: 'Activate' };
    this.dialog
      .open(DialogContentCheckComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            this._userService.activateUserId(user).subscribe({
              next: (v) => {
                let index = this.userData.indexOf(user);
                if (index > -1) {
                  user.dbStatus = true;
                  this.userData[index] = user;
                  this.dataSource = new MatTableDataSource(this.userData);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              },
              error: (e) => {
                this._messageService.openSnackBarError(e.error.message);
              },
              complete: () => console.info('complete'),
            });
          }
        },
      });
  }
}
