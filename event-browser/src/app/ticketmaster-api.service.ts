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

export interface SearchEventsParams {
  location: string;
  startDate: string;
  endDate: string;
  stateCode?: string;
  keyword?: string;
  classificationName?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TicketmasterApiService {
  private API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
  private API_KEY = environment.ticketmasterApiKey;

  constructor(private http: HttpClient) {}

  searchEvents(params: SearchEventsParams): Observable<TicketmasterResponse> {
    let httpParams = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('locale', '*')
      .set('page', (params.page || 0).toString())
      .set('size', (params.size || 50).toString())
      .set('sort', 'date,asc');

    // Add optional parameters
    if (params.startDate) {
      httpParams = httpParams.set('startDateTime', `${params.startDate}T00:00:00Z`);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDateTime', `${params.endDate}T23:59:59Z`);
    }
    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }
    if (params.location) {
      if (/^[a-zA-Z\s]+$/.test(params.location)) {
        httpParams = httpParams.set('city', params.location);
      }
    }
    if (params.stateCode) {
      httpParams = httpParams.set('stateCode', params.stateCode);
    }
    if (params.classificationName) {
      httpParams = httpParams.set('classificationName', params.classificationName);
    }

    return this.http.get<TicketmasterResponse>(this.API_URL, { params: httpParams });
  }
}