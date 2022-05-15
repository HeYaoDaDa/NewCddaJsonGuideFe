import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { cloneObject } from 'src/util/cloneObject';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { BodyPart } from '../../baseLoader/bodyPart/BodyPartLoader';
import { SubBodyPart } from '../../baseLoader/bodyPart/SubBodyPartLoader';
import { Material } from '../../baseLoader/material/Material';
import { ArmorMaterial } from './ArmorMaterialLoader';
import { ArmorPortion } from './ArmorPortionLoader';

export interface ArmorResistInterface {
  coverage: number;
  probability: number;
  formatCovers: [CddaItemRef, CddaItemRef[]][];
  coversSubBodyPart: CddaItemRef[];

  bashResist: number;
  cutResist: number;
  stabResist: number;
  bulletResist: number;

  acidResist: number;
  fireResist: number;
  encumber: number;
  maxEncumber?: number;
  envResist: number;
  envFilterResist: number;
}

export function computeArmorResists(subArmorPortions: ArmorPortion[], env: number) {
  const armorResists: ArmorResistInterface[][] = [];
  subArmorPortions.forEach((subArmorPortion) => {
    const subArmorPortionResist = getSubBodyPartArmorResist(subArmorPortion, env);
    armorResists.push(mergalArmorResist(subArmorPortionResist));
  });
  mergalArmorResistCover(armorResists);
  return armorResists;
}

function mergalArmorResistCover(armorResists: ArmorResistInterface[][]) {
  armorResists.forEach((resists) => {
    resists.forEach((resist) => {
      resist.formatCovers = [];
      const allResults = resist.coversSubBodyPart.map((subBodyPartName) => {
        const cddaItems = subBodyPartName.getCddaItems();
        return <[CddaItemRef, SubBodyPart]>[subBodyPartName, cddaItems[0].getData(new SubBodyPart())];
      });
      const subBodyParts = new Array<[CddaItemRef, SubBodyPart]>();
      const parents = new Array<CddaItemRef>();
      allResults.forEach((allResult) => {
        subBodyParts.push(allResult);
        if (!parents.find((parent) => parent.value.id === allResult[1].data.parent.value.id)) {
          parents.push(allResult[1].data.parent);
        }
      });

      const allResults1 = parents.map((parent) => {
        const cddaItems = parent.getCddaItems();
        return <[CddaItemRef, BodyPart]>[parent, cddaItems[0].getData(new BodyPart())];
      });
      const bodyParts = new Array<[CddaItemRef, BodyPart]>();
      allResults1.forEach((allResult) => {
        bodyParts.push(allResult);
      });
      bodyParts.forEach((bodyPart) => {
        const currentSubBodyParts = subBodyParts.filter(
          (subBodyPart) => subBodyPart[1].data.parent.value.id === bodyPart[0].value.id
        );
        resist.formatCovers.push([
          bodyPart[0],
          currentSubBodyParts.length === bodyPart[1].data.subBodyParts.length
            ? []
            : currentSubBodyParts.map((curSubBodyPart) => curSubBodyPart[0]),
        ]);
      });
    });
  });
}

function mergalArmorResist(armorResists: ArmorResistInterface[]) {
  const result = new Array<ArmorResistInterface>();
  armorResists.forEach((armorResist) => {
    let found = false;
    result.forEach((resultArmorResist) => {
      if (equalArmorResist(resultArmorResist, armorResist)) {
        found = true;
        // add cover
        armorResist.coversSubBodyPart.forEach((newCover) => {
          if (!resultArmorResist.coversSubBodyPart.find((cover) => cover.value.id === newCover.value.id)) {
            resultArmorResist.coversSubBodyPart.push(newCover);
          }
        });
        //add probability
        resultArmorResist.probability += armorResist.probability;
      }
    });
    if (!found) {
      result.push(armorResist);
    }
  });
  return result;
}

function equalArmorResist(l: ArmorResistInterface, r: ArmorResistInterface): boolean {
  return (
    l.coverage === r.coverage &&
    l.probability === r.probability &&
    l.bashResist === r.bashResist &&
    l.cutResist === r.cutResist &&
    l.stabResist === r.stabResist &&
    l.bulletResist === r.bulletResist &&
    l.acidResist === r.acidResist &&
    l.fireResist === r.fireResist &&
    l.encumber === r.encumber &&
    l.maxEncumber === r.maxEncumber &&
    l.envResist === r.envResist &&
    l.envFilterResist === r.envFilterResist
  );
}

function getSubBodyPartArmorResist(
  armorPortion: ArmorPortion,
  avgEnvironmentalProtection: number
): ArmorResistInterface[] {
  const armorMaterialObjects = armorPortion.data.armorMaterials.map((armorMaterial) => {
    const cddaItems = armorMaterial.data.id.getCddaItems();
    if (arrayIsNotEmpty(cddaItems)) {
      const material = cddaItems[0].getData(new Material()) as Material;
      return <[Material, ArmorMaterial]>[material, armorMaterial];
    }
    return <[Material, ArmorMaterial]>[new Material(), armorMaterial];
  });
  let result = new Array<ArmorResistInterface>({
    coverage: armorPortion.data.coverage,
    probability: 100,
    formatCovers: [],
    coversSubBodyPart: armorPortion.data.coversSubBodyPart,
    bashResist: 0,
    cutResist: 0,
    stabResist: 0,
    bulletResist: 0,
    acidResist: 0,
    fireResist: 0,
    encumber: armorPortion.data.encumber,
    maxEncumber: armorPortion.data.maxEncumber,
    envResist: armorPortion.data.environmentalProtection,
    envFilterResist: armorPortion.data.environmentalProtectionWithFilter,
  });
  armorMaterialObjects.forEach((item) => {
    const armorMaterialObject = item[0];
    const armorMaterial = item[1];
    const newResult = new Array<ArmorResistInterface>();
    result.forEach((resultItem) => {
      const hitArmorResist = {} as ArmorResistInterface;
      hitArmorResist.coverage = resultItem.coverage;
      hitArmorResist.probability = resultItem.probability * armorMaterial.data.coverage * 0.01;
      hitArmorResist.coversSubBodyPart = armorPortion.data.coversSubBodyPart;
      hitArmorResist.bashResist =
        resultItem.bashResist + armorMaterialObject.data.bashResist * armorMaterial.data.thickness;
      hitArmorResist.cutResist =
        resultItem.cutResist + armorMaterialObject.data.cutResist * armorMaterial.data.thickness;
      // stab resist is cut's 80%
      hitArmorResist.stabResist =
        resultItem.stabResist + armorMaterialObject.data.cutResist * 0.8 * armorMaterial.data.thickness;
      hitArmorResist.bulletResist =
        resultItem.bulletResist + armorMaterialObject.data.bulletResist * armorMaterial.data.thickness;

      hitArmorResist.acidResist = armorMaterialObject.data.acidResist * armorMaterial.data.coverage * 0.01;
      hitArmorResist.fireResist = armorMaterialObject.data.fireResist * armorMaterial.data.coverage * 0.01;
      if (avgEnvironmentalProtection < 10) {
        hitArmorResist.acidResist *= avgEnvironmentalProtection * 0.1;
        hitArmorResist.fireResist *= avgEnvironmentalProtection * 0.1;
      }
      hitArmorResist.acidResist += resultItem.acidResist;
      hitArmorResist.fireResist += resultItem.fireResist;
      hitArmorResist.encumber = resultItem.encumber;
      hitArmorResist.maxEncumber = resultItem.maxEncumber;
      hitArmorResist.envResist = resultItem.envResist;
      hitArmorResist.envFilterResist = resultItem.envFilterResist;
      newResult.push(hitArmorResist);
      // if the material is miss
      if (armorMaterial.data.coverage < 100) {
        const missArmorResist = cloneObject(resultItem);
        missArmorResist.probability = resultItem.probability * (100 - armorMaterial.data.coverage) * 0.01;
        newResult.push(missArmorResist);
      }
    });
    result = newResult;
  });
  return result;
}
