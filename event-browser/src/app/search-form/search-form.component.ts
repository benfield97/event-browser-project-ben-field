import { Component } from '@angular/core';

@Component({
  selector: 'app-search-form',
  imports: [],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {
  location: string = '';
  startDate: string = '';
  endDate: string = '';

  onSearch() {
    // Will implement API call here later
  }
}
