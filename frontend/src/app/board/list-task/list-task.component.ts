import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogContentCheckComponent } from 'src/app/dialog-content-check/dialog-content-check.component';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  listTask: any;
  name: string = '';

  constructor(
    private _taskService: TaskService,
    private _messageService: MessageService,
    private _router: Router,
    public dialog: MatDialog
  ) {
    this.listTask = {};
  }

  ngOnInit(): void {
    this._taskService.listTaskId(this.name).subscribe({
      next: (v) => {
        this.listTask = v.taskIdUserList;
      },
      error: (e) => {
        this._router.navigate(['/saveTask']);
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
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

  updateTask(task: any, status: string) {
    let tempStatus = task.taskStatus;
    task.taskStatus = status;
    this._taskService.updateTask(task).subscribe({
      next: (v) => {
        //this._messageService.openSnackBarSuccesfull(v.message);
      },
      error: (e) => {
        task.status = tempStatus;
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }
}
