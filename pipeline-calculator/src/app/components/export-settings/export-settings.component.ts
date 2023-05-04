import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.css']
})
export class ExportSettingsComponent implements OnInit {

  constructor() { }

  @Output() exportEmitter = new EventEmitter;

  ngOnInit(): void {
  }

  public exportData() {
    this.exportEmitter.emit(true);
  }

}
