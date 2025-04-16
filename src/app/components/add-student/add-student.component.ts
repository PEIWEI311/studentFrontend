import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  newStudent: Student = { id: '', name: '', age: 0, grade: '', email: '' };

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
  }

  addStudent(): void {
    this.studentService.addStudent(this.newStudent).subscribe(
      (response) => {
        
        this.newStudent = { id: '', name: '', age: 0, grade: '', email: '' };
      }
    );
  }
}
