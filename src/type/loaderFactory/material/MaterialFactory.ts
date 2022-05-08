import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Material } from 'src/type/loader/baseLoader/material/Material';
import { SuperFactory } from '../SuperFactory';

export class MaterialFactory extends SuperFactory {
  loaders = [new Material()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.material;
  }
}
