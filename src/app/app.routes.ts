import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { HelpCmpComponent } from './help-cmp/help-cmp.component';
import { StudentDashboardComponent } from '../student/dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherProfileComponent } from './teacher/profile/teacher-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StudentExamsComponent } from '../student/exams/exams.component';
import { TakeExamComponent } from '../student/take-exam/take-exam.component';
import { MyResultsComponent } from '../student/my-results/my-results.component';
import { StudentProfileComponent } from '../student/profile/student-profile.component';
import { TestSeriesComponent } from './test-series/test-series.component';
import { TeacherTestSeriesComponent } from './teacher/teacher-test-series/teacher-test-series.component';
import { CreateExamComponent } from './teacher/exam/create-exam/create-exam.component'; 
import { ViewExamComponent } from './teacher/exam/view-exam.component';
import { EditExamComponent } from './teacher/exam/edit-exam.component';


export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpCmpComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'teacher/profile', component: TeacherProfileComponent},
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'student/exams', component: StudentExamsComponent},
  { path: 'student/exam/:examId', component: TakeExamComponent},
  { path: 'student/my-results', component: MyResultsComponent },
  { path: 'student/profile', component: StudentProfileComponent},
  { path: 'test-series', component: TestSeriesComponent },
  { path: 'teacher/test-series', component: TeacherTestSeriesComponent},
  { path: 'teacher/create-exam', component: CreateExamComponent },
  { path: 'teacher/exam/edit/:id', component: EditExamComponent },       // <-- ADD THIS
  { path: 'teacher/exam/:id', component: ViewExamComponent },            // <-- ADD THIS
  { path: '', redirectTo: '/teacher/test-series', pathMatch: 'full' },
  { path: '**', redirectTo: '/teacher/test-series' },
  {
    path: 'teacher/exam/:examId/manage-questions',
    loadComponent: () =>
      import('./teacher/manage-questions/manage-questions.component').then(m => m.ManageQuestionsComponent)
  },

];
