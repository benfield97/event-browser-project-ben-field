import { Component } from '@angular/core';
import { SearchFormComponent } from './search-form/search-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchFormComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Event Browser'; 
}
