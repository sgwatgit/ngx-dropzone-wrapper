const Dropzone = require('dropzone');

import { 
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewEncapsulation } from '@angular/core';

import { DropzoneConfig } from './dropzone.interfaces'

@Component({
  selector: 'dropzone',
  template: require('dropzone.component.html'),
  styles: [require('dropzone.component.scss'), require('dropzone/dist/min/dropzone.min.css')],
  encapsulation: ViewEncapsulation.None
})
export class DropzoneComponent implements OnChanges, OnInit {
  private dropzone: any;
  private dropzoneElement: any;
  private baseUrl: string;

  @Output() uploadDone = new EventEmitter<any>();
  @Output() uploadError = new EventEmitter<Object>();

  @HostBinding('class.dropzone') useDropzoneClass = true;
  @HostBinding('class.no-preview') hidePreview: boolean = true;

  @Input() placeholderText: string = "Click or drop files to upload";
  @Input() urlParameters: string = null;
  @Input() backgroundImage: string;

  constructor( private elementRef: ElementRef, @Optional() private config: DropzoneConfig ) {
    this.config = config;

    this.baseUrl = this.config.url;

    this.dropzoneElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.dropzone = new Dropzone(this.dropzoneElement, this.config);

    this.dropzone.on('error', (err) => {
      this.uploadError.emit({msg: "Upload errored", error: err});

      setTimeout(() => {
        this.dropzone.removeAllFiles();
      }, this.hidePreview ? 1000 : 5000);
    });

    this.dropzone.on('success', (res) => {
      this.uploadDone.emit(res);

      setTimeout(() => {
        this.dropzone.removeAllFiles();
      }, this.hidePreview ? 1000 : 5000);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.baseUrl) {
      this.config.url = this.baseUrl + (this.urlParameters ? "?" + this.urlParameters : "");
    } else {
      console.info("You need to define server url in your config!");
    }
  }
}
