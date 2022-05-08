import SubBodyPartCard from 'src/components/loaderView/card/bodyPart/SubBodyPartCard.vue';
import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getBoolean, getNumber, getOptionalString, getString } from 'src/util/baseJsonUtil';
import { getAsyncId, getOptionalAsyncId, getTranslationString } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../SuperLoader';

export class SubBodyPart extends SuperLoader<SubBodyPartInterface> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async doLoad(data: SubBodyPartInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonObject);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(SubBodyPartCard, { cddaData: this }));
      result.push(h(JsonCard, { jsonItem: this.jsonItem }));
    }

    return result;
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.subBodyPart;
  }

  private async parseJson(data: SubBodyPartInterface, jsonObject: Record<string, unknown>) {
    data.name = getTranslationString(jsonObject, 'name');
    data.parent = await getAsyncId(jsonObject, 'parent', CddaType.bodyPart, commonUpdateName);
    data.secondary = getBoolean(jsonObject, 'secondary');
    data.maxCoverage = getNumber(jsonObject, 'max_coverage');
    data.side = getString(jsonObject, 'side', 'both');
    data.nameMultiple = getOptionalString(jsonObject, 'name_multiple');
    data.opposite = await getOptionalAsyncId(jsonObject, 'opposite', CddaType.subBodyPart, commonUpdateName);
  }
}

interface SubBodyPartInterface {
  name: string;
  parent: AsyncId;
  secondary: boolean;
  maxCoverage: number;
  side: string;
  nameMultiple?: string;
  opposite?: AsyncId;
}
