import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private env: string;

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }
  register(task: any) {
    return this._http.post<any>(this.env + 'task/register', task);
  }

  registerAdmin(task: any) {
    return this._http.post<any>(this.env + 'task/registerAdmin', task);
  }

  assignTask(taskAdnUser: any) {
    return this._http.put<any>(this.env + 'task/assign', taskAdnUser);
  }

  findTask(taskId: any) {
    return this._http.get<any>(this.env + 'task/findById/'+ taskId);
  }

  listAdmin(name: string) {
    return this._http.get<any>(this.env + 'task/list/' + name);
  }

  listTaskId(name: string) {
    return this._http.get<any>(this.env + 'task/listIdUser/' + name);
  }

  updateTask(task: any) {
    return this._http.put<any>(this.env + 'task/update', task);
  }

  deleteTask(task: any) {
    return this._http.delete<any>(this.env + 'task/delete/' + task._id);
  }

  saveTaskImg(task:any){
    return this._http.post<any>(this.env + 'task/saveTaskImg', task);
  }
}
