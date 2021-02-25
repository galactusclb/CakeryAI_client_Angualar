import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MainNaviComponent } from './pages/_shared_pages/main-navi/main-navi.component';
import { FooterComponent } from './pages/_shared_pages/footer/footer.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/application/dashboard/dashboard.component';
import { ProfileComponent } from './pages/application/profile/profile.component';
import { PredictComponent } from './pages/application/predict/predict.component';
import { TrainComponent } from './pages/application/predict/train/train.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PredictGenerateComponent } from './pages/application/predict/predict-generate/predict-generate.component';
import { IngredientsComponent } from './pages/application/predict/ingredients/ingredients.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainNaviComponent,
    FooterComponent,
    RegisterComponent,
    HomeComponent,
    ApplicationComponent,
    DashboardComponent,
    ProfileComponent,
    PredictComponent,
    TrainComponent,
    ConfirmAccountComponent,
    PredictGenerateComponent,
    IngredientsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
