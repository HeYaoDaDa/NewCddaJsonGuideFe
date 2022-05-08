import { i18n } from 'src/boot/i18n';

export class Translation {
  ctxt: string;
  raw: string;
  constructor(raw: string, ctxt: string) {
    this.raw = raw;
    this.ctxt = ctxt;
  }
  translate(): string {
    return i18n.global.t(this.ctxt + '.' + this.raw);
  }
}
