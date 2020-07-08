import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http : HttpClient) {

   }

   public PostEmployee(emp) : Observable<any>
   {
      return this.http.post("https://localhost:44309/api/employee", emp);
   }

   
   public GetEmployee() : Observable<any>
   {
      return this.http.get("https://localhost:44309/api/employee");
   }
}
