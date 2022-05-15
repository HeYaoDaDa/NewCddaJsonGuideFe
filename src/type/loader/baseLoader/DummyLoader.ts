import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';

export class Dummy extends SuperLoader<object> {
  doToView(): void {
    // Dummy no need
  }

  doLoad(): void {
    return;
  }
}
