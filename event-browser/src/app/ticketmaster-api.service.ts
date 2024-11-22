import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketmasterApiService {
  private API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
  private API_KEY = environment.ticketmasterApiKey;

  constructor(private http: HttpClient) {}

  searchEvents(location: string, startDate: string, endDate: string) {
    let params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('locale', '*')
      .set('city', location)
      .set('startDateTime', `${startDate}T00:00:00Z`)
      .set('endDateTime', `${endDate}T23:59:59Z`);

    return this.http.get(this.API_URL, { params });
  }
}