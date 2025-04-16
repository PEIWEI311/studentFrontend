import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Student } from '../models/student.model';

// 定义 API 返回的格式
interface ResponseResult<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'http://localhost:8080/api/students';  // 保持8080端口

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<ResponseResult<Student[]>>(`${this.apiUrl}`)
      .pipe(map(response => response.data));
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<ResponseResult<Student>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  findByEmail(email: string): Observable<Student> {
    return this.http.get<ResponseResult<Student>>(`${this.apiUrl}/email/${email}`)
      .pipe(map(response => response.data));
  }

  findByName(name: string): Observable<Student[]> {
    
    return this.http.get<ResponseResult<Student[]>>(`${this.apiUrl}/name/${name}`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching students by name:', error);
          throw error;
        })
      );
  }

  findByAgeRange(minAge: number, maxAge: number): Observable<Student[]> {
    return this.http.get<ResponseResult<Student[]>>(`${this.apiUrl}/age-range?minAge=${minAge}&maxAge=${maxAge}`)
      .pipe(map(response => response.data));
  }

  findByGrade(grade: string): Observable<Student[]> {
    return this.http.get<ResponseResult<Student[]>>(`${this.apiUrl}/grade/${grade}`)
      .pipe(map(response => response.data));
  }

  findByGradeAndAgeRange(grade: string, minAge: number, maxAge: number): Observable<Student[]> {
    return this.http.get<ResponseResult<Student[]>>(
      `${this.apiUrl}/grade-age?grade=${grade}&minAge=${minAge}&maxAge=${maxAge}`
    ).pipe(map(response => response.data));
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<ResponseResult<Student>>(`${this.apiUrl}`, student)
      .pipe(map(response => response.data));
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<ResponseResult<Student>>(`${this.apiUrl}/${student.id}`, student)
      .pipe(map(response => response.data));
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<ResponseResult<null>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  patchStudent(id: string, fields: any): Observable<Student> {
    return this.http.patch<ResponseResult<Student>>(`${this.apiUrl}/${id}`, fields)
      .pipe(map(response => response.data));
  }

  updateStudentsByGrade(grade: string, fields: any): Observable<Student[]> {
    return this.http.patch<ResponseResult<Student[]>>(`${this.apiUrl}/grade/${grade}`, fields)
      .pipe(map(response => response.data));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
