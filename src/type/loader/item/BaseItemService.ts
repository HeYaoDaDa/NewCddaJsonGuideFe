import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray } from 'src/util/baseJsonUtil';
import { BaseItemInterface } from './BaseItemLoader';

export async function assginMaterialsAndMaterialPortionsTotal(
  data: BaseItemInterface,
  jsonObject: Record<string, unknown>
) {
  data.materials = [];
  data.materialPortionsTotal = 0;
  await Promise.all(
    getArray(jsonObject, 'material').map(async (temp) => {
      let portion = 1;
      if (typeof temp === 'string') {
        data.materials.push([await AsyncId.new(temp, CddaType.material, commonUpdateName), 1]);
      } else {
        const material = temp as { type: string; portion?: number };
        data.materials.push([
          await AsyncId.new(material.type, CddaType.material, commonUpdateName),
          material.portion ?? 1,
        ]);
        portion = material.portion ?? 1;
      }
      data.materialPortionsTotal += portion;
    })
  );
}

export function calcBaseMovesPerAttack(volume: number, weight: number): number {
  return 65 + Math.floor(volume / 62.5) + Math.floor(weight / 60);
}

export async function calcCategory(): Promise<AsyncId> {
  //TODO
  return AsyncId.new('other', CddaType.itemCategory, commonUpdateName);
}

export function calcLength(volume: number): number {
  return Math.round(Math.cbrt(volume));
}
