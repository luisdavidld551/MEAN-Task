import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private env: string;

  constructor(private _http: HttpClient, private _router: Router) {
    this.env = environment.APP_URL;
  }

  login(user: any) {
    return this._http.post<any>(this.env + 'user/login', user);
  }

  registerUser(user: any) {
    return this._http.post<any>(this.env + 'user/register', user);
  }

  registerUserAdmin(user: any) {
    return this._http.post<any>(this.env + 'user/registerAdminUser', user);
  }

  getRole(email: string) {
    return this._http.get<any>(this.env + 'user/getRole/' + email);
  }

  getuser(name: string){
    return this._http.get<any>(this.env + 'user/list/' + name);
  }

  getuserAdmin(name: string){
    return this._http.get<any>(this.env + 'user/listAdmin/' + name);
  }

  getuserStatus(status: string){
    return this._http.get<any>(this.env + 'user/listStatus/' + status);
  }

  getuserId(id: string){
    return this._http.get<any>(this.env + 'user/findId/' + id);
  }

  profile(){
    return this._http.get<any>(this.env + 'user/profile')
  }

  profileImg(userImg:any){
    return this._http.put<any>(this.env + 'user/profileImg',userImg)
  }

  profilePassword(user:any){
    return this._http.put<any>(this.env + 'user/profilePassword',user)
  }

  deleteUserId(user: string){
    return this._http.put<any>(this.env + 'user/delete/',user);
  }

  activateUserId(user: string){
    return this._http.put<any>(this.env + 'user/activateUser/',user);
  }

  updateUserId(user: string){
    return this._http.put<any>(this.env + 'user/update/',user);
  }

  updateUserProfile(user: string){
    return this._http.put<any>(this.env + 'user/updateProfile/',user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getImg() {
    return localStorage.getItem('imgProfile');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' ? true : false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('imgProfile');
    this._router.navigate(['/login']);
  }
}
