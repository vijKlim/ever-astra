import { Component } from '@angular/core';
import {Cell} from 'angular2-smart-table';

@Component({
	selector: 'gauzy-email',
	templateUrl: './email.component.html',
	styleUrls: ['./email.component.scss']
})
export class EmailComponent  {
  renderValue = '';

  static componentInit(instance: EmailComponent, cell: Cell) {
    instance.renderValue = cell.getValue();
  }
}
