import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User, RegisterUserDto, LoginUserDto, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredUser();
  }

  // Load user from localStorage on service initialization
  private loadStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.userKey);

      if (token) {
        try {
          // Decode the JWT token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));

          // Check if token is expired
          const expiryTime = payload.exp * 1000; // Convert to milliseconds
          if (Date.now() >= expiryTime) {
            this.logout();
            return;
          }

          // Immediately set the user from localStorage if available
          if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
          }

          // Still get the latest user profile from the server
          this.getUserProfile().subscribe();
        } catch (error) {
          this.logout();
        }
      }
    }
  }

  // Register a new user
  register(user: RegisterUserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  // Login user
  login(credentials: LoginUserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  // Logout user
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey); // Also remove user data
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Get user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          if (error.status === 401) {
            this.logout();
          }
          return this.handleError(error);
        })
      );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) ? !!localStorage.getItem(this.tokenKey) : false;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get auth token
  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null;
  }

  // Handle authentication response
  private handleAuthentication(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, response.access_token);
      localStorage.setItem(this.userKey, JSON.stringify(response.user)); // Store user data
    }
    this.currentUserSubject.next(response.user);
  }

  // Error handling
  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid username or password. Please try again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
      }
    }
    console.error(`Original error: ${error.status} - ${error.message}`);
    return throwError(() => new Error(errorMessage));
  }
}
