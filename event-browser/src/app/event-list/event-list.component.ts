import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

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
}
