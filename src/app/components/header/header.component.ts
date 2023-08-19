import { Component, OnInit } from '@angular/core';
import { HeaderServiceService } from '../../header-service.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private headerService: HeaderServiceService) {}

  ngOnInit() {
    this.headerService.getReloadHeaderSubject().subscribe(() => {
      // Perform any necessary actions here to reload or re-render the header component
      console.log('Header reloaded');
    });
  }
}
