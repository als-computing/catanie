import { Component, Output, EventEmitter, Input } from "@angular/core";
import { Attachment } from "shared/sdk";

export interface PickedFile {
  content: string;
  name: string;
  size: number;
  type: string;
}

export interface SubmitCaptionEvent {
  attachmentId: string;
  caption: string;
}

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"],
})
export class FileUploaderComponent {
  @Input() attachments: Attachment[] = [];

  @Output() filePicked = new EventEmitter<PickedFile>();
  @Output() submitCaption = new EventEmitter<SubmitCaptionEvent>();
  @Output() deleteAttachment = new EventEmitter<string>();

  async onFileDropped(event: unknown) {
    const files = Array.from(event as FileList);

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          const bytesLength = bytes.byteLength;
          for (let i = 0; i < bytesLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const pickedFile: PickedFile = {
            content: "data:" + file.type + ";base64," + btoa(binary),
            name: file.name,
            size: file.size,
            type: file.type,
          };
          this.filePicked.emit(pickedFile);
        })
      );
    }
  }

  onFilePicked(files: FileList) {
    this.onFileDropped(files);
  }

  onSubmitCaption(attachmentId: string, caption: string) {
    const event: SubmitCaptionEvent = {
      attachmentId,
      caption,
    };
    this.submitCaption.emit(event);
  }

  onDeleteAttachment(attachmentId: string) {
    this.deleteAttachment.emit(attachmentId);
  }
}
