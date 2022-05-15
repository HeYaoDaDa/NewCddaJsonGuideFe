import SubBodyPartCard from 'src/components/loaderView/card/bodyPart/SubBodyPartCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getBoolean, getNumber, getOptionalString, getString } from 'src/util/baseJsonUtil';
import { getCddaItemRef, getOptionalCddaItemRef, getTranslationString } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../SuperLoader';

export class SubBodyPart extends SuperLoader<SubBodyPartInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(SubBodyPartCard, { cddaData: this }));
    }
  }

  doLoad(data: SubBodyPartInterface, jsonItem: JsonItem): void {
    const content = jsonItem.content as Record<string, unknown>;
    this.parseJson(data, content);
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.subBodyPart;
  }

  private parseJson(data: SubBodyPartInterface, jsonObject: Record<string, unknown>) {
    data.name = getTranslationString(jsonObject, 'name');
    data.parent = getCddaItemRef(jsonObject, 'parent', CddaType.bodyPart, commonUpdateName);
    data.secondary = getBoolean(jsonObject, 'secondary');
    data.maxCoverage = getNumber(jsonObject, 'max_coverage');
    data.side = getString(jsonObject, 'side', 'both');
    data.nameMultiple = getOptionalString(jsonObject, 'name_multiple');
    data.opposite = getOptionalCddaItemRef(jsonObject, 'opposite', CddaType.subBodyPart, commonUpdateName);
  }
}

interface SubBodyPartInterface {
  name: string;
  parent: CddaItemRef;
  secondary: boolean;
  maxCoverage: number;
  side: string;
  nameMultiple?: string;
  opposite?: CddaItemRef;
}
