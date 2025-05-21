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
        // Sort prompts to show liked ones first
        this.sortPrompts();
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

  toggleLike(prompt: Prompt): void {
    if (!prompt._id) return;

    // Optimistically update UI
    prompt.liked = !prompt.liked;

    // Sort prompts to show liked ones first
    this.sortPrompts();

    // Call API to persist the change
    this.promptService.toggleLike(prompt._id).subscribe({
      next: (updatedPrompt) => {
        console.log('Prompt like status updated:', updatedPrompt);
        // Update the prompt in the array with the response from the server
        const index = this.prompts.findIndex(p => p._id === updatedPrompt._id);
        if (index !== -1) {
          this.prompts[index] = updatedPrompt;
          // Re-sort prompts
          this.sortPrompts();
        }
      },
      error: (error) => {
        console.error('Error toggling like status:', error);
        // Revert the optimistic update if there's an error
        prompt.liked = !prompt.liked;
        // Re-sort prompts
        this.sortPrompts();
        alert('Failed to update like status: ' + (error.message || 'Unknown error'));
      }
    });
  }

  private sortPrompts(): void {
    // Sort prompts to show liked ones first
    this.prompts.sort((a, b) => {
      if (a.liked && !b.liked) return -1;
      if (!a.liked && b.liked) return 1;
      return 0;
    });
  }
}
