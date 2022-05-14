import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginData: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _messageService: MessageService
  ) {
    this.loginData = {};
  }

  ngOnInit(): void {}

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this._messageService.openSnackBarError('Failed process: Imcomplete data');
    } else {
      this._userService.login(this.loginData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/listTask']);
          this.getRole(this.loginData.email);
          this.loginData = {};
          this._messageService.openSnackBarSuccesfull('Welcome');
        },
        error: (e) => {
          this._messageService.openSnackBarError(e.error.message);
        },
        complete: () => console.info('complete'),
      });
    }
  }

  getRole(email: string) {
    this._userService.getRole(email).subscribe({
      next: (v) => {
        localStorage.setItem('role', v.userRole.role.name);
        localStorage.setItem('imgProfile', v.userRole.profileImg);
      },
      error: (e) => {
        this._messageService.openSnackBarError(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

}
