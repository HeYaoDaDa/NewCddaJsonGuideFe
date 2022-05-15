import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getCddaItemRefs } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { BodyPart } from '../../baseLoader/bodyPart/BodyPartLoader';
import { ArmorMaterial } from './ArmorMaterialLoader';

export function parseEncumber(jsonObject: Record<string, unknown>): [number, number | undefined] {
  const result: [number, number | undefined] = [0, undefined];
  if (jsonObject.hasOwnProperty('encumbrance')) {
    const temp = jsonObject.encumbrance;
    if (Array.isArray(temp)) {
      result[0] = (<Array<number>>temp)[0];
      result[1] = (<Array<number>>temp)[1];
    } else {
      result[0] = <number>temp;
    }
  }
  return result;
}

export function parseArmorMaterial(jsonObject: Record<string, unknown>, jsonItem: JsonItem): ArmorMaterial[] {
  const temp = getArray(jsonObject, 'material', []);
  if (arrayIsNotEmpty(temp)) {
    if (typeof temp[0] === 'object') {
      return temp.map((material) => {
        const armorMaterial = new ArmorMaterial();
        armorMaterial.load(jsonItem, <object>material);
        return armorMaterial;
      });
    } else {
      return temp.map((materialId) => {
        const armorMaterial = new ArmorMaterial();
        armorMaterial.load(jsonItem, { type: materialId });
        return armorMaterial;
      });
    }
  }
  return [];
}

export function parseCoversSubBodyParts(jsonObject: Record<string, unknown>, coversBodyPart: CddaItemRef[]) {
  const coversSubBodyPart = getCddaItemRefs(jsonObject, 'specifically_covers', CddaType.subBodyPart, commonUpdateName);

  // if is empty, add body part's all sub body part
  if (arrayIsEmpty(coversSubBodyPart) && arrayIsNotEmpty(coversBodyPart)) {
    coversBodyPart.forEach((item) => {
      const cddaItems = item.getCddaItems();
      if (arrayIsNotEmpty(cddaItems)) {
        const bodyPart = cddaItems[0].getData(new BodyPart()) as BodyPart;
        coversSubBodyPart.push(...bodyPart.data.subBodyParts);
      }
    });
  }

  return coversSubBodyPart;
}
