import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

// Add this interface above the component
interface EventImage {
  url: string;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  providers: [DatePipe]
})
export class EventListComponent {
  @Input() events: any[] = [];
  
  getEventImage(event: any): string {
    const image = event.images?.find((img: EventImage) => 
      img.url.includes('TABLET_LANDSCAPE_16_9')
    );
    return image?.url || '';
  }
}
