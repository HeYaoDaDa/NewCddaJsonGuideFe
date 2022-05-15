import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber, getOptionalNumber } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getCddaItemRefs } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { SubBodyPart } from '../../baseLoader/bodyPart/SubBodyPartLoader';
import { ArmorMaterial } from './ArmorMaterialLoader';
import { parseArmorMaterial, parseCoversSubBodyParts, parseEncumber } from './ArmorPortionService';
export class ArmorPortion extends SuperLoader<ArmorPortionInterface> {
  doToView(): void {
    // not need view
  }

  doLoad(data: ArmorPortionInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  public maxCoverage(bodyPartId: string): number {
    if (arrayIsEmpty(this.data.coversSubBodyPart)) {
      return 100;
    }
    let primary = 0;
    let secondary = 0;
    this.data.coversSubBodyPart.forEach((subCover) => {
      const cddaItems = subCover.getCddaItems();
      if (arrayIsNotEmpty(cddaItems)) {
        const subBodyPart = cddaItems[0].getData(new SubBodyPart()) as SubBodyPart;
        if (subBodyPart.data.parent.value.id === bodyPartId) {
          if (subBodyPart.data.secondary) {
            secondary += subBodyPart.data.maxCoverage;
          } else {
            primary += subBodyPart.data.maxCoverage;
          }
        }
      }
    });
    return primary > secondary ? primary : secondary;
  }

  private parseJson(data: ArmorPortionInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
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
    data.armorMaterials = parseArmorMaterial(jsonObject, jsonItem);
    data.layers = getCddaItemRefs(jsonObject, 'layers', CddaType.flag, commonUpdateName);
    data.coversBodyPart = getCddaItemRefs(jsonObject, 'covers', CddaType.bodyPart, commonUpdateName);
    data.coversSubBodyPart = parseCoversSubBodyParts(jsonObject, data.coversBodyPart);
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

  coversBodyPart: CddaItemRef[];
  coversSubBodyPart: CddaItemRef[];
  layers: CddaItemRef[];

  breathability?: number;
  isRigidLayerOnly: boolean;

  isRigid: boolean;
  isUniqueLayering: boolean;
  isComfortable: boolean;
}
