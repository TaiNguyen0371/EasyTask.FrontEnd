import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderServiceService } from 'src/app/header-service.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLogged: boolean = false
  summaryName = ''
  constructor(private router: Router,private headerService: HeaderServiceService) {

  }
  ngOnInit(): void {
    const ssUser = sessionStorage.getItem('login')
    if(ssUser) {
      this.isLogged = true
      const user = JSON.parse(ssUser)
      const arrName = user.fullName.split(' ')
      this.summaryName = (arrName[0][0] + arrName[arrName.length-1][0]).toLocaleUpperCase()
    }
  }
  signOut() {
    sessionStorage.removeItem('login')
    window.location.reload();
    this.router.navigate([''])
  }
}
