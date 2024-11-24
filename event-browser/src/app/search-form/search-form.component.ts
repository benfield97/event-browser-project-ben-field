import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { TicketmasterApiService, TicketmasterResponse } from '../ticketmaster-api.service';

@Component({
  selector: 'app-search-form',
  imports: [CommonModule, FormsModule, EventListComponent],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true
})
export class SearchFormComponent {
  // Location filters
  location: string = '';
  stateCode: string = '';

  // Event filters
  keyword: string = '';
  genre: string = '';

  // Date filters
  startDate: string = '';
  endDate: string = '';

  // State management
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
    const PAGE_SIZE = 50;

    this.apiService.searchEvents({
      location: this.location,
      startDate: this.startDate,
      endDate: this.endDate,
      stateCode: this.stateCode,
      keyword: this.keyword,
      classificationName: this.genre,
      page: this.currentPage,
      size: PAGE_SIZE
    }).subscribe({
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
