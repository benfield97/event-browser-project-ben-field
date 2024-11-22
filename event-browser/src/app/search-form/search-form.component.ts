import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { TicketmasterApiService } from '../ticketmaster-api.service';

interface TicketmasterResponse {
  _embedded?: {
    events: any[];
  };
}

@Component({
  selector: 'app-search-form',
  imports: [EventListComponent, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  standalone: true
})
export class SearchFormComponent {
  location: string = '';
  startDate: string = '';
  endDate: string = '';
  events: any[] = [];

  constructor(private apiService: TicketmasterApiService) {}

  onSearch() {
    this.apiService
      .searchEvents(this.location, this.startDate, this.endDate)
      .subscribe((data: TicketmasterResponse) => {
        this.events = [...(data._embedded?.events || [])];
      });
  }
}
