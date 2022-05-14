import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content-check',
  templateUrl: './dialog-content-check.component.html',
  styleUrls: ['./dialog-content-check.component.css'],
})
export class DialogContentCheckComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogContentCheckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
