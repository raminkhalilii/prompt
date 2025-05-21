import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PromptComponent } from './prompt.component';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, PromptComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty title and description initially', () => {
    expect(component.prompt.title).toBe('');
    expect(component.prompt.description).toBe('');
  });

  it('should reset form after submission', () => {
    // Set values
    component.prompt.title = 'Test Title';
    component.prompt.description = 'Test Description';

    // Call onSubmit
    component.onSubmit();

    // Check if values are reset
    expect(component.prompt.title).toBe('');
    expect(component.prompt.description).toBe('');
  });
});
