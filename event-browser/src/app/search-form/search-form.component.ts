import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { TicketmasterApiService, TicketmasterResponse } from '../ticketmaster-api.service';

@Component({
  selector: 'app-search-form',
  imports: [CommonModule, FormsModule, EventListComponent],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  standalone: true
})
export class SearchFormComponent {
  location: string = '';
  startDate: string = '';
  endDate: string = '';
  events: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  hasMoreEvents: boolean = false;

  constructor(private apiService: TicketmasterApiService) {}

  onSearch() {
    // Reset everything on new search
    this.events = [];
    this.currentPage = 0;
    this.totalPages = 0;
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;

    this.apiService.searchEvents(this.location, this.startDate, this.endDate, this.currentPage)
      .subscribe({
        next: (response: TicketmasterResponse) => {
          if (response._embedded?.events) {
            // Add new events to existing array, ensuring no duplicates
            const newEvents = response._embedded.events;
            const uniqueEvents = [...this.events];
            
            newEvents.forEach(newEvent => {
              if (!uniqueEvents.some(e => e.id === newEvent.id)) {
                uniqueEvents.push(newEvent);
              }
            });

            this.events = uniqueEvents;
            this.totalPages = response.page.totalPages;
            this.hasMoreEvents = this.currentPage < (this.totalPages - 1);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching events:', error);
          this.isLoading = false;
        }
      });
  }

  loadMore() {
    if (this.hasMoreEvents && !this.isLoading) {
      this.currentPage++;
      this.loadEvents();
    }
  }
}
