import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  // Setup fresh component instance before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no events message when events array is empty', () => {
    component.events = [];
    fixture.detectChanges();
    
    const noEventsElement = fixture.nativeElement.querySelector('.no-events');
    expect(noEventsElement.textContent).toContain('No events found');
  });

  it('should display event cards when events are provided', () => {
    // Mock event data structure matching API response
    const mockEvents = [{
      name: 'Test Event',
      dates: {
        start: {
          localDate: '2024-03-20',
          localTime: '20:00:00'
        }
      },
      _embedded: {
        venues: [{
          name: 'Test Venue',
          city: { name: 'Test City' }
        }]
      },
      images: [
        { url: 'test-image-TABLET_LANDSCAPE_16_9.jpg' },
        { url: 'test-image.jpg' }
      ]
    }];

    component.events = mockEvents;
    fixture.detectChanges();

    const eventCards = fixture.nativeElement.querySelectorAll('.event-card');
    expect(eventCards.length).toBe(1);
    expect(eventCards[0].textContent).toContain('Test Event');
    expect(eventCards[0].textContent).toContain('Test Venue');
    expect(eventCards[0].textContent).toContain('Test City');
  });

  // Tests image selection logic - should prefer TABLET_LANDSCAPE_16_9 format
  it('should get correct event image', () => {
    const mockEvent = {
      images: [
        { url: 'test1.jpg' },
        { url: 'test2-TABLET_LANDSCAPE_16_9.jpg' },
        { url: 'test3.jpg' }
      ]
    };

    const imageUrl = component.getEventImage(mockEvent);
    expect(imageUrl).toBe('test2-TABLET_LANDSCAPE_16_9.jpg');
  });

  it('should return empty string when no images are available', () => {
    const mockEvent = { images: [] };
    const imageUrl = component.getEventImage(mockEvent);
    expect(imageUrl).toBe('');
  });
});
