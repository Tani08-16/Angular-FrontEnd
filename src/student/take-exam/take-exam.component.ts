import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit {
  examId: number = 0;
  examTitle: string = '';
  duration: number = 0;
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  answers: { [questionId: number]: string } = {};
  markedForReview: Set<number> = new Set();
  timer: number = 0;
  displayTimer: string = '';
  showInstructions: boolean = true;
  acceptedInstructions: boolean = false;
  intervalRef: any;

  showConfirmation: boolean = false;
  pauseTime: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.fetchExamData();
  }

  fetchExamData(): void {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    this.http.get<any>(`http://localhost:7095/api/ExamAttempt/start/${this.examId}`, { headers })
      .subscribe({
        next: (data) => {
          this.examTitle = data.examTitle;
          this.duration = data.duration;
          this.questions = data.questions;
          this.timer = this.duration * 60;
          this.updateTimerDisplay();
        },
        error: (err) => {
          console.error('Failed to fetch exam:', err);
        }
      });
  }

  getStats() {
    let attempted = Object.keys(this.answers).length;
    let marked = this.markedForReview.size;
    let notAttempted = this.questions.length - attempted;
    return { attempted, marked, notAttempted };
  }

  startExam(): void {
    if (!this.acceptedInstructions) {
      alert('Please accept the instructions before starting the exam.');
      return;
    }
    this.showInstructions = false;
    this.startTimer();
  }

  startTimer(): void {
    this.intervalRef = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.intervalRef);
        this.submitExam(); // auto-submit on timeout
      }
    }, 1000);
  }

  updateTimerDisplay(): void {
    const mins = Math.floor(this.timer / 60).toString().padStart(2, '0');
    const secs = (this.timer % 60).toString().padStart(2, '0');
    this.displayTimer = `${mins}:${secs}`;
  }

  selectAnswer(option: string): void {
    const questionId = this.questions[this.currentQuestionIndex].questionId;
    this.answers[questionId] = option;
  }

  isSelected(option: string): boolean {
    const questionId = this.questions[this.currentQuestionIndex].questionId;
    return this.answers[questionId] === option;
  }

  getOptionClass(option: string): string {
    return this.isSelected(option) ? 'selected' : '';
  }

  markAndSave(): void {
    const questionId = this.questions[this.currentQuestionIndex].questionId;
    this.markedForReview.add(questionId);
    this.goToNext();
  }

  clearResponse(): void {
    const questionId = this.questions[this.currentQuestionIndex].questionId;
    delete this.answers[questionId];
    this.markedForReview.delete(questionId);
  }

  goToNext(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToPrevious(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  isAnswered(questionId: number): boolean {
    return !!this.answers[questionId];
  }

  isMarked(questionId: number): boolean {
    return this.markedForReview.has(questionId);
  }

  getQuestionStatus(questionId: number): string {
    if (this.isAnswered(questionId)) return 'answered';
    if (this.isMarked(questionId)) return 'marked';
    return 'unanswered';
  }

  submitExam(): void {
    clearInterval(this.intervalRef);
    this.pauseTime = this.timer;
    this.showConfirmation = true;
  }

  cancelSubmit(): void {
    this.showConfirmation = false;
    this.timer = this.pauseTime;
    this.startTimer();
  }

  confirmSubmit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = payload?.userId || payload?.UserId || payload?.sub;

    const submission = {
      examId: this.examId,
      answers: Object.entries(this.answers).map(([questionId, answer]) => ({
        questionId: +questionId,
        answer
      }))
    };

    this.http.post('http://localhost:7095/api/ExamAttempt/submit', submission, { headers })
      .subscribe({
        next: () => {
          //alert("Exam submitted successfully!");
          this.router.navigate(['/student/my-results']);
        },
        error: (err) => {
          console.error('Error submitting exam:', err);
          alert('Submission failed.');
        }
      });
  }
}