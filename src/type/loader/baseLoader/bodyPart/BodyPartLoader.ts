import BodyPartCard from 'src/components/loaderView/card/bodyPart/BodyPartCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getArray } from 'src/util/baseJsonUtil';
import { getTranslationString } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';

export class BodyPart extends SuperLoader<BodyPartInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(BodyPartCard, { cddaData: this }));
    }
  }

  doLoad(data: BodyPartInterface, jsonItem: JsonItem): void {
    const content = jsonItem.content as Record<string, unknown>;
    this.parseJson(data, content);
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.bodyPart;
  }

  private parseJson(data: BodyPartInterface, jsonObject: Record<string, unknown>) {
    data.name = getTranslationString(jsonObject, 'name');
    data.subBodyParts = getArray(jsonObject, 'sub_parts').map((value) =>
      CddaItemRef.new(<string>value, CddaType.subBodyPart, commonUpdateName)
    );
  }
}

interface BodyPartInterface {
  name: string;
  subBodyParts: CddaItemRef[];
}
