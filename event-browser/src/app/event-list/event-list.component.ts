import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  providers: [DatePipe]
})
export class EventListComponent {
  @Input() events: any[] = [];
}
