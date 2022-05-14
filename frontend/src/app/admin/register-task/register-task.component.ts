import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-register-task',
  templateUrl: './register-task.component.html',
  styleUrls: ['./register-task.component.css']
})
export class RegisterTaskComponent implements OnInit {
  registerTaskData: any;
  selectedFile: any;

  constructor(
    private _taskService: TaskService,
    private _router: Router,
    private _messageService: MessageService
  ) {
    this.registerTaskData = {};
    this.selectedFile = null;
  }

  ngOnInit(): void {}

  registerTask() {
    if (!this.registerTaskData.name || !this.registerTaskData.description) {
      this._messageService.openSnackBarError('Incomplete data');
    } else {
      const data = new FormData();

      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerTaskData.name);
      data.append('description', this.registerTaskData.description);

      this._taskService.registerAdmin(data).subscribe({
        next: (v) => {
          this._router.navigate(['/listTaskAdmin']);
          this._messageService.openSnackBarSuccesfull('Task create');
        },
        error: (e) => {
          this._messageService.openSnackBarError(e.error.message);
        },
        complete: () => console.info('complete'),
      });
    }
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }
}
