import BodyPartCard from 'src/components/loaderView/card/bodyPart/BodyPartCard.vue';
import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray } from 'src/util/baseJsonUtil';
import { getTranslationString } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';

export class BodyPart extends SuperLoader<BodyPartInterface> {
  async doLoad(data: BodyPartInterface, jsonItem: JsonItem): Promise<void> {
    const content = jsonItem.content as Record<string, unknown>;
    await this.parseJson(data, content);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(BodyPartCard, { cddaData: this }));
      result.push(h(JsonCard, { jsonItem: this.jsonItem }));
    }

    return result;
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.bodyPart;
  }

  private async parseJson(data: BodyPartInterface, jsonObject: Record<string, unknown>) {
    data.name = getTranslationString(jsonObject, 'name');
    data.subBodyParts = await Promise.all(
      getArray(jsonObject, 'sub_parts').map((value) =>
        AsyncId.new(<string>value, CddaType.subBodyPart, commonUpdateName)
      )
    );
  }
}

interface BodyPartInterface {
  name: string;
  subBodyParts: AsyncId[];
}
