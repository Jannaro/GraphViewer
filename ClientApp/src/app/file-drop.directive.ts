import { Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {

  constructor() { 
    this.dragEnterCount = 0;
  }

  dragEnterCount: number;
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() filesDropped = new EventEmitter<any>();

  isTypeAccepted(dt: DataTransfer): boolean {
    return true;
  }

  // Dragenter listener
  @HostListener('dragenter', ['$event']) public onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if(this.isTypeAccepted(event.dataTransfer)) {
      ++this.dragEnterCount;
      this.fileOver = true;
    }
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if(this.isTypeAccepted(event.dataTransfer)) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if(this.isTypeAccepted(event.dataTransfer) && --this.dragEnterCount == 0) {
      this.fileOver = false;
    }
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if(this.isTypeAccepted(event.dataTransfer)) {
      this.fileOver = false;
      let files = event.dataTransfer.files;
      if (files.length > 0) {
        this.filesDropped.emit(files);
      }
    }
  }
}
