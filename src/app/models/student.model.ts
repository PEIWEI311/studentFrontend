export interface Student {
  id: string;  
  name: string;
  age: number;
  grade: string;
  email: string;
  additionalFields?: {  
    [key: string]: any;
  };
}
