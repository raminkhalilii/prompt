import { Component, OnInit, AfterViewInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  private animationsInitialized = false;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Initialize any data or services
    // Add a class to the html element to indicate JS is loaded
    if (isPlatformBrowser(this.platformId)) {
      // Add js-loaded class to html element
      document.documentElement.classList.add('js-loaded');

      // Force a reflow to ensure CSS changes are applied immediately
      void document.documentElement.offsetHeight;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize animations immediately
      this.initScrollAnimations();

      // Also set up a small delay to ensure animations are properly initialized
      // This helps with hydration timing issues
      setTimeout(() => {
        // Reinitialize animations even if already initialized
        // This ensures elements are visible after hydration
        this.initScrollAnimations();
      }, 300);
    }
  }

  /**
   * Initialize scroll animations using Intersection Observer API
   * This detects when elements come into view and adds the 'visible' class
   * to trigger the CSS animations
   */
  private initScrollAnimations(): void {
    this.animationsInitialized = true;

    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Add the 'visible' class when the element is intersecting
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Stop observing the element after it becomes visible
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Get all elements with the 'animate-on-scroll' class
    const animatedElements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');

    // Force all elements to be visible initially, then properly animate them
    animatedElements.forEach((element: Element) => {
      // Ensure element has will-change property for better performance
      (element as HTMLElement).style.willChange = 'opacity, transform';

      // Add delay for elements with data-delay attribute
      const delay = element.getAttribute('data-delay');
      if (delay) {
        (element as HTMLElement).style.transitionDelay = `${delay}ms`;
      }
    });

    // Check if elements are already in viewport on page load
    const checkInitialVisibility = () => {
      animatedElements.forEach((element: Element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 1.1 && // Add 10% margin
          rect.bottom >= -50 // Allow elements slightly above viewport
        );

        // If element is already visible in viewport, add visible class immediately
        if (isVisible) {
          // Add visible class with a slight delay to ensure CSS transitions work
          setTimeout(() => {
            element.classList.add('visible');
          }, 10);
        } else {
          // Otherwise observe it for when it comes into view
          observer.observe(element);
        }
      });
    };

    // Run the initial visibility check
    checkInitialVisibility();
  }
}
