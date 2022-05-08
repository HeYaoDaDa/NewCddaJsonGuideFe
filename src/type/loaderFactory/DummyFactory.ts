import { CddaItem } from 'src/type/common/CddaItem';
import { Dummy } from 'src/type/loader/baseLoader/DummyLoader';
import { SuperFactory } from 'src/type/loaderFactory/SuperFactory';

export class DummyFactory extends SuperFactory {
  loaders = [new Dummy()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type !== undefined;
  }
}
