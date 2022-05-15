import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getTranslationString } from 'src/util/jsonUtil';

export class Mod extends SuperLoader<ModInterface> {
  doToView(): void {
    //TODO
  }

  doLoad(data: ModInterface, jsonItem: JsonItem): void {
    const content = jsonItem.content as Record<string, unknown>;
    data.id = jsonItem.jsonId;
    data.name = getTranslationString(content, 'name');
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.modInfo;
  }
}

interface ModInterface {
  id: string;
  name: string;
}
