import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    PredictComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
