import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { RoleService } from '../../services/role.service';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  roles: Array<any>;
  constructor(
    private _roleService: RoleService,
    private _messageService: MessageService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roles = [];
  }

  ngOnInit(): void {
    this._roleService.getRole('').subscribe({
      next: (v: any) => {
        this.roles = v.roleList;
      },
      error: (e) => {
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
