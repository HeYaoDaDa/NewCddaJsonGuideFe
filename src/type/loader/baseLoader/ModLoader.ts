import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getTranslationString } from 'src/util/jsonUtil';

export class Mod extends SuperLoader<ModInterface> {
  async doLoad(data: ModInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem): Promise<void> {
    data.id = jsonItem.jsonId;
    data.name = getTranslationString(jsonObject, 'name');
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.modInfo;
  }
}

interface ModInterface {
  id: string;
  name: string;
}
