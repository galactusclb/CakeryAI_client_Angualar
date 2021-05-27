import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/application/dashboard/dashboard.component';
import { ProfileComponent } from './pages/application/profile/profile.component';
import { PredictComponent } from './pages/application/predict/predict.component';
import { TrainComponent } from './pages/application/predict/train/train.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { AuthGuard } from './services/auth.guard';
import { PredictGenerateComponent } from './pages/application/predict/predict-generate/predict-generate.component';
import { ProductComponent } from './pages/application/product/product.component';
import { ProductInfoComponent } from './pages/application/product/product-info/product-info.component';
import { ProductListComponent } from './pages/application/product/product-list/product-list.component';
import { ProductAddByInsertComponent } from './pages/application/product/productAdd/product-add-by-insert/product-add-by-insert.component';
import { ProductAddByUploadComponent } from './pages/application/product/productAdd/product-add-by-upload/product-add-by-upload.component';
import { IngredientListComponent } from './pages/application/product/ingredient-list/ingredient-list.component';
import { IngredientAddComponent } from './pages/application/product/ingredient-add/ingredient-add.component';
import { TestingUiComponent } from './testing-ui/testing-ui.component';
import { UserAccountComponent } from './pages/application/profile/user-account/user-account.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { UserSubscriptionComponent } from './pages/application/profile/user-subscription/user-subscription.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'test', component: TestingUiComponent },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'confirm/:token',
    component: ConfirmAccountComponent,
  },
  {
    path: 'forgetpassword',
    component: ForgetPasswordComponent,
  },
  {
    path: 'passwordreset',
    component: PasswordResetComponent,
  },
  {
    path: 'app',
    component: ApplicationComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'test', component: TestingUiComponent },
      { path: 'dashboard', component: PredictGenerateComponent },
      { path: 'predict', component: PredictComponent },
      { path: 'train', component: TrainComponent },

      {
        path: 'products',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
            path: 'list',
            component: ProductListComponent,
            // data: { redirectTo: ['list'] },
          },
          {
            path: 'product/:id',
            component: ProductInfoComponent,
          },
          { path: 'new/form', component: ProductAddByInsertComponent },
          { path: 'new/upload', component: ProductAddByUploadComponent },
          {
            path: 'ingredients',
            component: IngredientListComponent,
            // data: { redirectTo: ['ingredients'] },
          },
          {
            path: 'ingredients/new',
            component: IngredientAddComponent,
            // data: { redirectTo: ['ingredients/new'] },
          },
        ],
        // canActivateChild: [AuthChildGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          { path: '', redirectTo: 'user', pathMatch: 'full' },
          { path: 'user', component: UserAccountComponent },
          { path: 'subscription', component: UserSubscriptionComponent },
        ],
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
