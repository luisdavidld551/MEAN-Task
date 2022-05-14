import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.css'],
})
export class RegisterRoleComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegisterRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  cancelar() {
    this.dialogRef.close();
  }
}
