import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private env: string;

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }

  register(role: any) {
    return this._http.post<any>(this.env + 'role/register', role);
  }

  getRole(name: string) {
    return this._http.get<any>(this.env + 'role/list/' + name);
  }

  getRoleStatus(status: string) {
    return this._http.get<any>(this.env + 'role/listStatus/' + status);
  }

  listRoleId(role: any) {
    return this._http.get<any>(this.env + 'role/find/' + role);
  }

  updateRole(role: any) {
    return this._http.put<any>(this.env + 'role/update', role);
  }

  deleteRole(role: any) {
    return this._http.put<any>(this.env + 'role/delete', role);
  }
}
