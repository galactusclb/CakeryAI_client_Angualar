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
import { ProductComponent } from './pages/application/product/product.component';
import { ProductListComponent } from './pages/application/product/product-list/product-list.component';
import { ProductInfoComponent } from './pages/application/product/product-info/product-info.component';
import { ProductAddByInsertComponent } from './pages/application/product/productAdd/product-add-by-insert/product-add-by-insert.component';
import { ProductAddByUploadComponent } from './pages/application/product/productAdd/product-add-by-upload/product-add-by-upload.component';
import { IngredientListComponent } from './pages/application/product/ingredient-list/ingredient-list.component';
import { IngredientAddComponent } from './pages/application/product/ingredient-add/ingredient-add.component';
import { TestingUiComponent } from './testing-ui/testing-ui.component';
import { UserAccountComponent } from './pages/application/profile/user-account/user-account.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
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
    ProductComponent,
    ProductListComponent,
    ProductInfoComponent,
    ProductAddByInsertComponent,
    ProductAddByUploadComponent,
    IngredientListComponent,
    IngredientAddComponent,
    TestingUiComponent,
    UserAccountComponent,
    PasswordResetComponent,
    ForgetPasswordComponent,
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
