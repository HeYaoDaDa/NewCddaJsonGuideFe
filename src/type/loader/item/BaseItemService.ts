import { CddaType } from 'src/constant/cddaType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray } from 'src/util/baseJsonUtil';
import { getCddaItemsByType } from 'src/util/cddaItemUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { Recipe } from '../recipe/RecipeLoader';
import { BaseItemInterface } from './BaseItemLoader';

export function assginMaterialsAndMaterialPortionsTotal(data: BaseItemInterface, jsonObject: Record<string, unknown>) {
  data.materials = [];
  data.materialPortionsTotal = 0;
  getArray(jsonObject, 'material').forEach((temp) => {
    let portion = 1;
    if (typeof temp === 'string') {
      data.materials.push([CddaItemRef.new(temp, CddaType.material, commonUpdateName), 1]);
    } else {
      const material = temp as { type: string; portion?: number };
      data.materials.push([CddaItemRef.new(material.type, CddaType.material, commonUpdateName), material.portion ?? 1]);
      portion = material.portion ?? 1;
    }
    data.materialPortionsTotal += portion;
  });
}

export function calcBaseMovesPerAttack(volume: number, weight: number): number {
  return 65 + Math.floor(volume / 62.5) + Math.floor(weight / 60);
}

export function calcCategory(): CddaItemRef {
  //TODO
  return CddaItemRef.new('other', CddaType.itemCategory, commonUpdateName);
}

export function calcLength(volume: number): number {
  return Math.round(Math.cbrt(volume));
}

export function getAllRecipe(jsonId: string): Recipe[] {
  const recipes: Recipe[] = [];
  getCddaItemsByType(CddaType.recipe).filter((cddaItem) => {
    const recipe = cddaItem.jsonItem.content as recipeResultInterface;
    if ((recipe.result === jsonId || (recipe.byproducts ?? []).some((b) => b[0] === jsonId)) && !recipe.obsolete) {
      recipes.push(cddaItem.getData(new Recipe()) as Recipe);
    }
  });
  return recipes.sort((a, b) => {
    const aScore = a.data.result?.value.id === jsonId ? 0 : 1;
    const bScore = b.data.result?.value.id === jsonId ? 0 : 1;
    return aScore - bScore;
  });
}
interface recipeResultInterface {
  result?: string;
  obsolete?: boolean;
  byproducts?: ([string] | [string, number])[];
}
