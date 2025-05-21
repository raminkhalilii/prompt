import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/prompt.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = `${environment.apiUrl}/prompts`;

  constructor(private http: HttpClient) {}

  // Get all prompts
  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get a single prompt by ID
  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new prompt
  createPrompt(prompt: CreatePromptDto): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, prompt)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing prompt
  updatePrompt(id: string, prompt: UpdatePromptDto): Observable<Prompt> {
    return this.http.patch<Prompt>(`${this.apiUrl}/${id}`, prompt)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a prompt
  deletePrompt(id: string): Observable<Prompt> {
    return this.http.delete<Prompt>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
