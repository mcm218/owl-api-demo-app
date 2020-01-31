import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: "safe" })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    // Sanitizes URL
    // ONLY use if can guarentee URL is from safe source
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
