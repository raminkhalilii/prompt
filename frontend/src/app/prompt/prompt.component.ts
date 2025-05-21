import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PromptService } from '../services/prompt.service';
import { CreatePromptDto, UpdatePromptDto, Prompt } from '../models/prompt.model';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  prompt: CreatePromptDto | UpdatePromptDto = {
    title: '',
    description: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  isEditMode = false;
  promptId: string | null = null;
  pageTitle = 'Create New Writing Prompt';
  submitButtonText = 'Create Prompt';

  constructor(
    private promptService: PromptService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID parameter
    this.promptId = this.route.snapshot.paramMap.get('id');

    if (this.promptId) {
      this.isEditMode = true;
      this.pageTitle = 'Edit Writing Prompt';
      this.submitButtonText = 'Update Prompt';
      this.loadPrompt(this.promptId);
    }
  }

  loadPrompt(id: string): void {
    this.isSubmitting = true;

    this.promptService.getPrompt(id).subscribe({
      next: (prompt: Prompt) => {
        this.prompt = {
          title: prompt.title,
          description: prompt.description
        };
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error loading prompt:', error);
        this.submitError = true;
        this.errorMessage = 'Failed to load prompt. ' + (error.message || '');
        this.isSubmitting = false;
      }
    });
  }

  onSubmit() {
    if (!this.prompt.title || !this.prompt.description) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';

    if (this.isEditMode && this.promptId) {
      // Update existing prompt
      this.promptService.updatePrompt(this.promptId, this.prompt).subscribe({
        next: (response) => {
          console.log('Prompt updated successfully:', response);
          this.submitSuccess = true;
          this.isSubmitting = false;

          // Navigate back to list after short delay
          setTimeout(() => {
            this.router.navigate(['/prompts']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating prompt:', error);
          this.submitError = true;
          this.isSubmitting = false;
          this.errorMessage = error.message || 'An unknown error occurred';
        }
      });
    } else {
      // Create new prompt
      this.promptService.createPrompt(this.prompt as CreatePromptDto).subscribe({
        next: (response) => {
          console.log('Prompt created successfully:', response);
          this.submitSuccess = true;
          this.isSubmitting = false;

          // Reset form after short delay to show success message
          setTimeout(() => {
            this.router.navigate(['/prompts']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating prompt:', error);
          this.submitError = true;
          this.isSubmitting = false;
          this.errorMessage = error.message || 'An unknown error occurred';
        }
      });
    }
  }

  resetForm() {
    if (this.isEditMode && this.promptId) {
      // If in edit mode, reload the original prompt
      this.loadPrompt(this.promptId);
    } else {
      // If in create mode, clear the form
      this.prompt = {
        title: '',
        description: ''
      };
    }

    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';
  }

  cancelEdit() {
    this.router.navigate(['/prompts']);
  }
}
