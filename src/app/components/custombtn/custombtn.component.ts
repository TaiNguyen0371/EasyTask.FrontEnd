import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custombtn',
  templateUrl: './custombtn.component.html',
  styleUrls: ['./custombtn.component.css']
})
export class CustombtnComponent {
  @Input() buttonText: string = ''

  @Output() clickEvent = new EventEmitter();
  onClick() {
    this.clickEvent.emit();
  }
}
