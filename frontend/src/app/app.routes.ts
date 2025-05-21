import { Routes } from '@angular/router';
import { PromptComponent } from './prompt/prompt.component';
import { PromptListComponent } from './prompt-list/prompt-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'prompts', component: PromptListComponent, canActivate: [authGuard] },
  { path: 'prompt/create', component: PromptComponent, canActivate: [authGuard] },
  { path: 'prompt/edit/:id', component: PromptComponent, canActivate: [authGuard] }
];
