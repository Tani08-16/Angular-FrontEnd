import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { HelpCmpComponent } from './help-cmp/help-cmp.component';
import { StudentDashboardComponent } from '../student/dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherProfileComponent } from './teacher/profile/teacher-profile.component';
import { AdminDashboardComponent } from '../Admin/dashboard/admin-dashboard.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component'; // Import AddTeacherComponent
import { appRoutes } from './app.routes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageQuestionsComponent } from './teacher/manage-questions/manage-questions.component';

import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    AboutComponent,
    HelpCmpComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    AdminDashboardComponent,
    // Add your component here!
    ManageQuestionsComponent,
    AddTeacherComponent // Declare AddTeacherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}