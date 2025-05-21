import { Routes } from '@angular/router';
import { PromptComponent } from './prompt/prompt.component';
import { PromptListComponent } from './prompt-list/prompt-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompt/create', component: PromptComponent },
  { path: 'prompt/edit/:id', component: PromptComponent }
];
