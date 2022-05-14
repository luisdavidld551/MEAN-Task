import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from '../../services/user.service';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
})
export class AssignTaskComponent implements OnInit {
  idTask: any;
  dataTask: any;
  dataUser: any;
  taskAndUser: any;
  displayedColumns: string[] = ['NAME', 'EMAIL', 'ACTION'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(
    private _taskService: TaskService,
    private _userService: UserService,
    private _router: Router,
    private _messageService: MessageService,
    private _routerActive: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.dataTask = {};
    this.dataUser = {};
    this.taskAndUser = {};
    this.dataSource = new MatTableDataSource(this.dataUser);
  }

  ngOnInit(): void {
    this.idTask = this._routerActive.snapshot.paramMap.get('_id');

    this._taskService.findTask(this.idTask).subscribe({
      next: (v: any) => {
        this.dataTask = v.findTask;
      },
      error: (e) => {
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });

    this._userService.getuser('').subscribe({
      next: (v: any) => {
        this.dataUser = v.userList;
        this.dataSource = new MatTableDataSource(this.dataUser);
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

  assignTaskUser(user: any) {
    if (!user._id || !this.idTask) {
      this._messageService.openSnackBarError('Incomplete data');
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { title: 'Task', action: 'Assign' };

      this.dialog
        .open(DialogContentCheckComponent, dialogConfig)
        .afterClosed()
        .subscribe({
          next: (v) => {
            if (v) {
              this.taskAndUser.taskId = this.idTask;
              this.taskAndUser.userId = user._id;
              this._taskService.assignTask(this.taskAndUser).subscribe({
                next: (v: any) => {
                  this._router.navigate(['/listTaskAdmin']);
                  this._messageService.openSnackBarSuccesfull(v.message);
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
}
