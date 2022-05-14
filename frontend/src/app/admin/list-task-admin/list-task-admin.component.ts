import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
//import { AssignTaskComponent } from '../assign-task/assign-task.component';
import { Router } from '@angular/router';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-list-task-admin',
  templateUrl: './list-task-admin.component.html',
  styleUrls: ['./list-task-admin.component.css'],
})
export class ListTaskAdminComponent implements OnInit {
  listTask: any;
  name: string = '';
  displayedColumns: string[] = [
    'NAME',
    'DESCRIPTION',
    'DATE',
    'STATUS',
    'MANAGER',
    'ACTIONS',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(
    private _taskService: TaskService,
    private _messageService: MessageService,
    private _router: Router,
    public dialog: MatDialog
  ) {
    this.listTask = {};
    this.dataSource = new MatTableDataSource(this.listTask);
  }

  ngOnInit(): void {
    this.listTaskIdUser();
  }

  listTaskIdUser() {
    this._taskService.listAdmin(this.name).subscribe({
      next: (v: any) => {
        this.listTask = v.taskList;
        this.dataSource = new MatTableDataSource(this.listTask);
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

  deleteTask(task: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: 'Task', action: 'Delete' };

    this.dialog
      .open(DialogContentCheckComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            this._taskService.deleteTask(task).subscribe({
              next: (v) => {
                let index = this.listTask.indexOf(task);
                if (index > -1) {
                  this.listTask.splice(index, 1);
                  this.dataSource = new MatTableDataSource(this.listTask);
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

  assignTask(task: any) {
    console.log(task);
    //AssignTaskComponent.dataTask.emit({data: task});
    this._router.navigate(['/assignTask/', task._id]);
  }
}
