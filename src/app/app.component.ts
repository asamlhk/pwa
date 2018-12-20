import { Component, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  constructor(private router: Router) {

    router.events.subscribe( (event: Event) => {

      if (event instanceof NavigationStart) {
          // Show loading indicator
          console.log({
            event: event.url
          })

          window['DataLayer'] = {
            'registered_id': 123,
            'event_category': 'register',
            'event_action' : event.url,
            'event_label' : event.url,
          }

          // console.log(window.DataLayer)
      }

 
  });
  }
}
