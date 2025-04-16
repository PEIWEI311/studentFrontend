// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { SearchStudentComponent } from './components/search-student/search-student.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentListComponent, AddStudentComponent, SearchStudentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'student-management-app';
}