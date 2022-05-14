import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerData: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _messageService: MessageService
  ) {
    this.registerData = {};
  }

  ngOnInit(): void {}

  registerUser() {
    if (
      !this.registerData.name ||
      !this.registerData.email ||
      !this.registerData.phone ||
      !this.registerData.password
    ) {
      this._messageService.openSnackBarError('Failed process: Imcomplete data');
    } else {
      this._userService.registerUser(this.registerData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/saveTask']);
          this._messageService.openSnackBarSuccesfull('Successfull user registration');
          this.registerData = {};
        },
        error: (e) => {
          this._messageService.openSnackBarError( e.error.message);
        },
        complete: () => console.info('complete'),
      });
    }
  }
}
