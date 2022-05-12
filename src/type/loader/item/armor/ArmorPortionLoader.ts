import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getBoolean, getNumber, getOptionalNumber } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getAsyncIds } from 'src/util/jsonUtil';
import { VNode } from 'vue';
import { SubBodyPart } from '../../baseLoader/bodyPart/SubBodyPartLoader';
import { ArmorMaterial } from './ArmorMaterialLoader';
import { parseArmorMaterial, parseCoversSubBodyParts, parseEncumber } from './ArmorPortionService';
export class ArmorPortion extends SuperLoader<ArmorPortionInterface> {
  async doLoad(data: ArmorPortionInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    // not need view
    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  public async maxCoverage(bodyPartId: string): Promise<number> {
    if (arrayIsEmpty(this.data.coversSubBodyPart)) {
      return 100;
    }
    let primary = 0;
    let secondary = 0;
    await Promise.all(
      this.data.coversSubBodyPart.map(async (subCover) => {
        const cddaItems = await subCover.getCddaItems();
        if (arrayIsNotEmpty(cddaItems)) {
          const subBodyPart = (await cddaItems[0].getData(new SubBodyPart())) as SubBodyPart;
          if (subBodyPart.data.parent.value.id === bodyPartId) {
            if (subBodyPart.data.secondary) {
              secondary += subBodyPart.data.maxCoverage;
            } else {
              primary += subBodyPart.data.maxCoverage;
            }
          }
        }
      })
    );
    return primary > secondary ? primary : secondary;
  }

  private async parseJson(data: ArmorPortionInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    const encumberTuple = parseEncumber(jsonObject);
    data.encumber = encumberTuple[0];
    data.maxEncumber = encumberTuple[1];

    data.volumeEncumberModifier = getNumber(jsonObject, 'volume_encumber_modifier', 1);
    data.coverage = getNumber(jsonObject, 'coverage', 0);
    data.coverageMelee = getNumber(jsonObject, 'cover_melee', data.coverage);
    data.coverageRanged = getNumber(jsonObject, 'cover_ranged', data.coverage);
    data.coverageVitals = getNumber(jsonObject, 'cover_vitals', 0);
    data.avgThickness = getNumber(jsonObject, 'material_thickness', 0);

    data.environmentalProtection = getNumber(jsonObject, 'environmental_protection', 0);
    data.environmentalProtectionWithFilter = getNumber(jsonObject, 'environmental_protection_with_filter', 0);

    data.breathability = getOptionalNumber(jsonObject, 'breathability');
    data.isRigidLayerOnly = getBoolean(jsonObject, 'rigid_layer_only', false);

    const asyncPromises = new Array<Promise<unknown>>();
    asyncPromises.push(
      (async () => (data.armorMaterials = await parseArmorMaterial(jsonObject, jsonItem)))(),
      (async () => (data.layers = await getAsyncIds(jsonObject, 'layers', CddaType.flag, commonUpdateName)))(),
      (async () => {
        data.coversBodyPart = await getAsyncIds(jsonObject, 'covers', CddaType.bodyPart, commonUpdateName);
        data.coversSubBodyPart = await parseCoversSubBodyParts(jsonObject, data.coversBodyPart);
      })()
    );
    await Promise.allSettled(asyncPromises);
  }
}

interface ArmorPortionInterface {
  encumber: number;
  maxEncumber?: number;

  volumeEncumberModifier: number;

  coverage: number;
  coverageMelee: number;
  coverageRanged: number;
  coverageVitals: number;

  avgThickness: number;

  environmentalProtection: number;
  environmentalProtectionWithFilter: number;

  armorMaterials: ArmorMaterial[];

  coversBodyPart: AsyncId[];
  coversSubBodyPart: AsyncId[];
  layers: AsyncId[];

  breathability?: number;
  isRigidLayerOnly: boolean;

  isRigid: boolean;
  isUniqueLayering: boolean;
  isComfortable: boolean;
}
