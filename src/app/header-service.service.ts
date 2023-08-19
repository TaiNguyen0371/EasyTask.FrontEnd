import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {
  private reloadHeaderSubject = new Subject<void>();

  reloadHeader() {
    this.reloadHeaderSubject.next();
  }

  getReloadHeaderSubject() {
    return this.reloadHeaderSubject.asObservable();
  }
}
