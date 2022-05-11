import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getAsyncIds } from 'src/util/jsonUtil';
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

export async function parseArmorMaterial(
  jsonObject: Record<string, unknown>,
  jsonItem: JsonItem
): Promise<ArmorMaterial[]> {
  const temp = getArray(jsonObject, 'material', []);
  if (arrayIsNotEmpty(temp)) {
    if (typeof temp[0] === 'object') {
      return await Promise.all(
        temp.map((material) => {
          const armorMaterial = new ArmorMaterial();
          armorMaterial.load(jsonItem, <object>material);
          return armorMaterial;
        })
      );
    } else {
      return await Promise.all(
        temp.map((materialId) => {
          const armorMaterial = new ArmorMaterial();
          armorMaterial.load(jsonItem, { type: materialId });
          return armorMaterial;
        })
      );
    }
  }
  return [];
}

export async function parseCoversSubBodyParts(jsonObject: Record<string, unknown>, coversBodyPart: AsyncId[]) {
  const coversSubBodyPart = await getAsyncIds(
    jsonObject,
    'specifically_covers',
    CddaType.subBodyPart,
    commonUpdateName
  );

  // if is empty, add body part's all sub body part
  if (arrayIsEmpty(coversSubBodyPart) && arrayIsNotEmpty(coversBodyPart)) {
    await Promise.all(
      coversBodyPart.map((item) =>
        item.getCddaItems().then(async (cddaItems) => {
          if (arrayIsNotEmpty(cddaItems)) {
            const bodyPart = (await cddaItems[0].getData(new BodyPart())) as BodyPart;
            coversSubBodyPart.push(...bodyPart.data.subBodyParts);
          }
        })
      )
    );
  }

  return coversSubBodyPart;
}
