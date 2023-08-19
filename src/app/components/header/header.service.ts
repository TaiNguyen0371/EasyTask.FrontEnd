import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private headerReloadSubject = new Subject<void>();

  headerReload$ = this.headerReloadSubject.asObservable();

  triggerHeaderReload(): void {
    this.headerReloadSubject.next();
  }
}
