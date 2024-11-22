import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TicketmasterResponse {
  _embedded?: {
    events: any[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TicketmasterApiService {
  private API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
  private API_KEY = environment.ticketmasterApiKey;

  constructor(private http: HttpClient) {}

  searchEvents(location: string, startDate: string, endDate: string, page: number = 0, size: number = 50): Observable<TicketmasterResponse> {
    let params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('locale', '*')
      .set('city', location)
      .set('startDateTime', `${startDate}T00:00:00Z`)
      .set('endDateTime', `${endDate}T23:59:59Z`)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<TicketmasterResponse>(this.API_URL, { params });
  }
}