import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[] = [];
  showEditForm: boolean = false;
  studentToEdit: Student | null = null;
  editFormData: Student = { id: '', name: '', age: 0, grade: '', email: '' };

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe(
      response => {
        // 处理返回的ResponseResult格式，获取data部分
        if (response && 'data' in response) {
          this.students = response.data as Student[];
        } else {
          this.students = response as Student[];
        }
      }
    );
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.loadStudents();
    });
  }

  editStudent(id: string): void {
    console.log(`Editing student with ID: ${id}`);
    
    // Find the student in the current list
    const student = this.students.find(s => s.id === id);
    
    if (student) {
      this.studentToEdit = student;
      this.editFormData = { ...student };
      this.showEditForm = true;
    } else {
      console.error(`Student with ID ${id} not found in the list`);
      alert('Student not found in the current list');
    }
  }
  
  cancelEdit(): void {
    this.showEditForm = false;
    this.studentToEdit = null;
  }

  saveEdit(): void {
    if (!this.studentToEdit) return;
    
    this.studentService.updateStudent(this.editFormData)
      .subscribe({
        next: () => {
          alert('Student updated successfully!');
          this.showEditForm = false;
          this.studentToEdit = null;
          this.loadStudents();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert(`Failed to update student: ${err.message || 'Unknown error'}`);
        }
      });
  }
}
