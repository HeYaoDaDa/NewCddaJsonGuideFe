import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getTranslationString } from 'src/util/jsonUtil';

export class Mod extends SuperLoader<ModInterface> {
  async load(value: JsonItem): Promise<void> {
    if (this.isLoad || !this.validateValue(value)) return;
    this.isLoad = true;
    const data = this.data;
    const jsonObject = value.content as Record<string, unknown>;

    data.id = value.jsonId;
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
