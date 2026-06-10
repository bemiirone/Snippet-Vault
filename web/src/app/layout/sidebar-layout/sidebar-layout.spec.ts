import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarLayout } from './sidebar-layout';
import { MessageService, ConfirmationService } from 'primeng/api';

describe('SidebarLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarLayout],
      providers: [
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SidebarLayout);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
