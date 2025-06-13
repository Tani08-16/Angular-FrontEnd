import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Question {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

@Component({
  selector: 'app-manage-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css']
})
export class ManageQuestionsComponent implements OnInit {
  questions: Question[] = [];
  questionForm: FormGroup;
  editingQuestionId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      optionA: ['', Validators.required],
      optionB: ['', Validators.required],
      optionC: ['', Validators.required],
      optionD: ['', Validators.required],
      correctOption: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  addQuestion(): void {
    const newQuestion: Question = {
      questionId: Date.now(),
      ...this.questionForm.value
    };
    this.questions.push(newQuestion);
    this.questionForm.reset();
  }

  editQuestion(q: Question): void {
    this.editingQuestionId = q.questionId;
    this.questionForm.patchValue(q);
  }

  updateQuestion(): void {
    const idx = this.questions.findIndex(q => q.questionId === this.editingQuestionId);
    if (idx > -1) {
      this.questions[idx] = {
        questionId: this.editingQuestionId!,
        ...this.questionForm.value
      };
    }
    this.editingQuestionId = null;
    this.questionForm.reset();
  }

  cancelEdit(): void {
    this.editingQuestionId = null;
    this.questionForm.reset();
  }

  deleteQuestion(id: number): void {
    this.questions = this.questions.filter(q => q.questionId !== id);
  }
}
