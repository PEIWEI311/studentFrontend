import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./search-student.component.css']
})
export class SearchStudentComponent implements OnInit {

  searchName: string = '';
  searchResults: Student[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Edit functionality
  showEditForm: boolean = false;
  studentToEdit: Student | null = null;
  editFormData: Student = { id: '', name: '', age: 0, grade: '', email: '' };

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
  }

  searchStudents(): void {
    this.errorMessage = '';
    this.isLoading = true;
    
    if (this.searchName.trim()) {
      this.studentService.findByName(this.searchName)
        .subscribe({
          next: (response: any) => {
            // 直接处理完整的响应对象，而不是假设它已经处理过
            if (response && typeof response === 'object') {
              // 检查是否是原始的 ResponseResult 格式
              if (response.data !== undefined && Array.isArray(response.data)) {
                this.searchResults = response.data;
              }
              // 检查是否是已经提取的学生数组
              else if (Array.isArray(response)) {
                this.searchResults = response;
              } 
              // 单个学生对象的情况
              else if (response.id) {
                this.searchResults = [response];
              }
              // 空结果
              else {
                this.searchResults = [];
              }
            } else {
              this.searchResults = [];
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Search error details:', err);
            
            // 根据不同错误类型提供更具体的错误信息
            if (err.status === 0) {
              this.errorMessage = 'CORS ';
            } else if (err.status === 404) {
              this.errorMessage = '';
            } else if (err.status === 500) {
              this.errorMessage = '';
            } else {
              this.errorMessage = '';
            }
            
            this.searchResults = [];
            this.isLoading = false;
          }
        });
    } else {
      this.searchResults = [];
      this.isLoading = false;
    }
  }

  

  editStudent(id: string): void {
    console.log(`Editing student with ID: ${id}`);
    
    // Get student details before editing
    this.studentService.getStudentById(id)
      .subscribe({
        next: (student) => {
          // Prepare the edit form
          this.studentToEdit = student;
          // Create a copy to prevent direct binding
          this.editFormData = { ...student };
          // Show the form
          this.showEditForm = true;
        },
        error: (err: any) => {
          console.error('Error getting student details:', err);
          this.errorMessage = `Failed to get student details: ${err.message || 'Unknown error'}`;
        }
      });
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
          // Close the form
          this.showEditForm = false;
          this.studentToEdit = null;
          // Refresh results
          this.searchStudents();
        },
        error: (err: any) => {
          console.error('Update error:', err);
          this.errorMessage = `Failed to update student: ${err.message || 'Unknown error'}`;
        }
      });
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      console.log(`Deleting student with ID: ${id}`);
      this.studentService.delete(id)
        .subscribe({
          next: () => {
            console.log('Student deleted successfully');
            // Remove the deleted student from search results
            this.searchResults = this.searchResults.filter(student => student.id !== id);
          },
          error: (err: any) => {  // Added type annotation here
            console.error('Delete error:', err);
            this.errorMessage = `Failed to delete student: ${err.message || 'Unknown error'}`;
          }
        });
    }
  }
}
