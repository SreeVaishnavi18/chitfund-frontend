import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})


export class ChitgroupService {
  private apiUrl = 'http://localhost:8000/api/chit-groups/create/';  

  constructor(private http: HttpClient) {}

  createChitGroup(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getAllChitGroups() {
    return this.http.get<any[]>('http://localhost:8000/api/chit-groups/');
  }
  
}
