import { OnInit, Component, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../services/role.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { UpdateRoleComponent } from '../update-role/update-role.component';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css'],
})
export class ListRoleComponent implements OnInit {
  listRole: any;
  displayedColumns: string[] = ['NAME', 'DESCRIPTION', 'STATUS', 'ACTIONS'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(
    private _roleService: RoleService,
    private _messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.listRole = {};
    this.dataSource = new MatTableDataSource(this.listRole);
  }

  ngOnInit(): void {
    this._roleService.getRole('').subscribe({
      next: (v: any) => {
        this.listRole = v.roleList;
        this.dataSource = new MatTableDataSource(this.listRole);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (e) => {
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    const dialog1 = this.dialog
      .open(RegisterRoleComponent, {
        data: {},
      })
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v != undefined) {
            if (!v.name || !v.description) {
              this._messageService.openSnackBarError(
                'Failed process: Imcomplete data'
              );
            } else {
              this._roleService.register(v).subscribe({
                next: (v) => {
                  this.listRole.push(v.role);
                  this.dataSource = new MatTableDataSource(this.listRole);
                  this.table.renderRows();
                  this._messageService.openSnackBarSuccesfull(
                    'Successfull role registration'
                  );
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

  openDialogUpdate(dataRole: any) {
    this.dialog
      .open(UpdateRoleComponent, {
        data: dataRole,
      })
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v != undefined) {
            if (!v.name || !v.description) {
              this._messageService.openSnackBarError(
                'Failed process: Imcomplete data'
              );
            } else {
              this._roleService.updateRole(v).subscribe({
                next: (v) => {
                  let index = this.listRole.indexOf(v);
                  if (index > -1) {
                    this.listRole[index] = v;
                    this.dataSource = new MatTableDataSource(this.listRole);
                    this.table.renderRows();
                    this._messageService.openSnackBarSuccesfull(
                      'Successful Role Update'
                    );
                  }
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

  openDialogConfirmar(role: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: 'Role', action: 'Delete' };

    this.dialog
      .open(DialogContentCheckComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            this._roleService.deleteRole(role).subscribe({
              next: (v) => {
                let index = this.listRole.indexOf(role);
                if (index > -1) {
                  this.listRole.splice(index, 1);
                  this.dataSource = new MatTableDataSource(this.listRole);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this._messageService.openSnackBarSuccesfull(v.message);
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
