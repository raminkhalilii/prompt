import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromptService } from '../services/prompt.service';
import { Prompt } from '../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.scss']
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  error = false;
  errorMessage = '';

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.loadPrompts();
  }

  loadPrompts(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.promptService.getPrompts().subscribe({
      next: (prompts) => {
        this.prompts = prompts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading prompts:', error);
        this.error = true;
        this.errorMessage = error.message || 'Failed to load prompts';
        this.loading = false;
      }
    });
  }

  deletePrompt(id: string): void {
    if (confirm('Are you sure you want to delete this prompt?')) {
      this.promptService.deletePrompt(id).subscribe({
        next: () => {
          this.prompts = this.prompts.filter(prompt => prompt._id !== id);
        },
        error: (error) => {
          console.error('Error deleting prompt:', error);
          alert('Failed to delete prompt: ' + (error.message || 'Unknown error'));
        }
      });
    }
  }
}
