import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber, getString } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
export class ArmorMaterial extends SuperLoader<ArmorMaterialInterface> {
  doToView(result: VNode[], data: ArmorMaterialInterface): void {
    result.push(
      h(MyField, { label: 'name' }, () => h(MyTextAsyncId, { content: toArray(data.id) })),
      h(MyField, { label: 'coverage' }, () => h(MyText, { content: data.coverage })),
      h(MyField, { label: 'thickness' }, () => h(MyText, { content: data.thickness }))
    );
    if (data.thickness)
      result.push(
        h(MyField, { label: 'ignoreSheetThickness' }, () => h(MyText, { content: data.ignoreSheetThickness }))
      );
  }

  doLoad(data: ArmorMaterialInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: ArmorMaterialInterface, jsonObject: Record<string, unknown>) {
    data.id = CddaItemRef.new(getString(jsonObject, 'type'), CddaType.material, commonUpdateName);
    data.coverage = getNumber(jsonObject, 'covered_by_mat', 100);
    data.thickness = getNumber(jsonObject, 'thickness');
    data.ignoreSheetThickness = getBoolean(jsonObject, 'ignore_sheet_thickness');
  }
}

interface ArmorMaterialInterface {
  id: CddaItemRef;
  coverage: number;
  thickness: number;
  ignoreSheetThickness: boolean;
}
