import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { HelpCmpComponent } from './help-cmp/help-cmp.component';
import { StudentDashboardComponent } from '../student/dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentExamsComponent } from '../student/exams/exams.component';
import { TakeExamComponent } from '../student/take-exam/take-exam.component';
import { MyResultsComponent } from '../student/my-results/my-results.component';
import { StudentProfileComponent } from '../student/profile/student-profile.component';
import { TestSeriesComponent } from './test-series/test-series.component';
import { ViewTeacherComponent } from '../Admin/view-teacher/view-teacher.component';
import { ViewStudentsComponent } from '../Admin/view-students/view-students.component';

// Admin components
import { AddTeacherComponent } from '../Admin/add-teacher/add-teacher.component';
import { AdminProfileComponent } from '../Admin/profile/admin-profile.component'; // ✅ Correct class name and path

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // ✅ Lazy loading login component
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },

  { path: 'signup', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpCmpComponent },

  // Student Routes
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'student/exams', component: StudentExamsComponent },
  { path: 'student/exam/:examId', component: TakeExamComponent },
  { path: 'student/my-results', component: MyResultsComponent },
  { path: 'student/profile', component: StudentProfileComponent },

  // Teacher Route
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },

  // ✅ Admin Routes
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('../Admin/dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  { path: 'admin/add-teacher', component: AddTeacherComponent },
  {
    path: 'admin/profile',
    loadComponent: () =>
      import('../Admin/profile/admin-profile.component').then(
        (m) => m.AdminProfileComponent
      ),
  },
  { path: 'admin/teachers', component: ViewTeacherComponent },
  { path: 'admin/students', component: ViewStudentsComponent },
  // Test Series
  { path: 'test-series', component: TestSeriesComponent },
];