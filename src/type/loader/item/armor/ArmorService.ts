import { CddaType } from 'src/constant/cddaType';
import { Flag } from 'src/constant/FlagsContant';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { cloneObject } from 'src/util/cloneObject';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { SubBodyPart } from '../../baseLoader/bodyPart/SubBodyPartLoader';
import { Material } from '../../baseLoader/material/Material';
import { BaseItem } from '../BaseItemLoader';
import { ArmorInterface } from './ArmorLoader';
import { ArmorMaterial } from './ArmorMaterialLoader';
import { ArmorPortion } from './ArmorPortionLoader';

/**
 * if SubArmorPortions no has Armor Material
 * we need pass item's material infer it
 * @param item base item info
 */
export function inferSubArmorPortionsArmorMaterial(
  jsonItem: JsonItem,
  subArmorPortions: ArmorPortion[],
  item: BaseItem
) {
  subArmorPortions
    .filter((subArmorPortion) => arrayIsEmpty(subArmorPortion.data.armorMaterials))
    .forEach((subArmorPortion) => {
      const skipScale: boolean = item.data.materialPortionsTotal === 0;
      item.data.materials.forEach((itemMaterial) => {
        const armorMaterial = new ArmorMaterial();
        if (skipScale) {
          armorMaterial.load(jsonItem, {
            type: itemMaterial[0].value.id,
            thickness: item.data.materials.length * subArmorPortion.data.avgThickness,
            ignore_sheet_thickness: true,
          });
        } else {
          armorMaterial.load(jsonItem, {
            type: itemMaterial[0].value.id,
            thickness: (itemMaterial[1] / item.data.materialPortionsTotal) * subArmorPortion.data.avgThickness,
            ignore_sheet_thickness: true,
          });
        }
        subArmorPortion.data.armorMaterials.push(armorMaterial);
      });
    });
}

/**
 * set max encumber, avgThickness, rigid and comfortable
 * @param item base item info
 */
export function setSubArmorPotionsField(subArmorPortions: ArmorPortion[], item: BaseItem) {
  subArmorPortions.forEach((subArmorPortion) => {
    // set max encumber
    if (!subArmorPortion.data.maxEncumber) {
      let totalNonrigidVolume = 0;
      item.data.pockets.map((pocket) => {
        if (!pocket.data.rigid) {
          totalNonrigidVolume += pocket.data.volumeCapacity * pocket.data.volumeEncumberModifier;
        }
      });
      subArmorPortion.data.maxEncumber =
        subArmorPortion.data.encumber + (totalNonrigidVolume * subArmorPortion.data.volumeEncumberModifier) / 250;
    }

    // reset avgThickness
    let armorMaterialCount = 0;
    let avgThickness = 0;
    subArmorPortion.data.armorMaterials.forEach((armorMaterial) => {
      avgThickness += (armorMaterial.data.thickness * armorMaterial.data.coverage) / 100;
      armorMaterialCount++;
    });
    if (armorMaterialCount > 0 && avgThickness > 0) {
      subArmorPortion.data.avgThickness = avgThickness;
    }
  });
}

export function setSubArmorPotionsrRigidComfortable(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.forEach((subArmorPortion) =>
    subArmorPortion.data.armorMaterials
      .filter((armorMaterial) => armorMaterial.data.coverage > 40)
      .forEach((armorMaterial) => {
        const cddaItems = armorMaterial.data.id.getCddaItems();
        if (arrayIsNotEmpty(cddaItems)) {
          const material = cddaItems[0].getData(new Material()) as Material;
          if (material.data.soft) {
            subArmorPortion.data.isComfortable = true;
          } else {
            subArmorPortion.data.isRigid = true;
          }
        }
      })
  );
}

/**
 * consolidate SubArmorPotions to ArmorPotions
 */
export function consolidateSubArmorPotions(armorPortions: ArmorPortion[], subArmorPortions: ArmorPortion[]) {
  subArmorPortions
    .filter((subArmorPortion) => arrayIsNotEmpty(subArmorPortion.data.coversBodyPart))
    .forEach((subArmorPortion) => {
      subArmorPortion.data.coversBodyPart.forEach((subCover) => {
        let found = false;
        armorPortions
          .filter((armorPortion) =>
            armorPortion.data.coversBodyPart.some((bodyPartId) => bodyPartId.value.id === subCover.value.id)
          )
          .forEach((armorPortion) => {
            found = true;
            addEncumber(armorPortion, subArmorPortion);
            let subScale = subArmorPortion.maxCoverage(subCover.value.id);
            let scale = armorPortion.maxCoverage(subCover.value.id);
            subScale *= 0.01;
            scale *= 0.01;
            consolidatePortionBaseInfo(armorPortion, subArmorPortion, subScale, scale);
            consolidateMaterial(subArmorPortion, armorPortion, subScale, scale);
            consolidateLayerAndSubBodyPart(subArmorPortion, armorPortion);
          });
        if (!found) {
          const newArmorPortion = getNewArmorPotrtion(subArmorPortion, subCover);
          armorPortions.push(newArmorPortion);
        }
      });
    });

  function getNewArmorPotrtion(subArmorPortion: ArmorPortion, subCover: CddaItemRef) {
    const newArmorPortion = cloneObject(subArmorPortion);
    newArmorPortion.data.coversBodyPart = [subCover];
    const maxCoverage = newArmorPortion.maxCoverage(subCover.value.id);
    const scale = maxCoverage * 0.01;
    newArmorPortion.data.coverage *= scale;
    newArmorPortion.data.coverageMelee *= scale;
    newArmorPortion.data.coverageRanged *= scale;
    newArmorPortion.data.armorMaterials.forEach((newArmorMaterial) => {
      newArmorMaterial.data.coverage *= newArmorPortion.data.coverage / 100;
    });
    return newArmorPortion;
  }

  function consolidateLayerAndSubBodyPart(subArmorPortion: ArmorPortion, armorPortion: ArmorPortion) {
    subArmorPortion.data.layers.forEach((subLayer) => {
      if (!armorPortion.data.layers.some((layer) => layer.value.id === subLayer.value.id)) {
        armorPortion.data.layers.push(subLayer);
      }
    });

    subArmorPortion.data.coversSubBodyPart.forEach((subArmorSubBodyPart) => {
      if (
        !armorPortion.data.coversSubBodyPart.some(
          (armorSubBodyPart) => armorSubBodyPart.value.id === subArmorSubBodyPart.value.id
        )
      ) {
        armorPortion.data.coversSubBodyPart.push(subArmorSubBodyPart);
      }
    });
  }

  function consolidatePortionBaseInfo(
    armorPortion: ArmorPortion,
    subArmorPortion: ArmorPortion,
    subScale: number,
    scale: number
  ) {
    armorPortion.data.coverage += subArmorPortion.data.coverage * subScale;
    armorPortion.data.coverageMelee += subArmorPortion.data.coverageMelee * subScale;
    armorPortion.data.coverageRanged += subArmorPortion.data.coverageRanged * subScale;
    armorPortion.data.coverageVitals += subArmorPortion.data.coverageVitals;

    armorPortion.data.avgThickness =
      (subArmorPortion.data.avgThickness * subScale + armorPortion.data.avgThickness * scale) / (subScale + scale);
    armorPortion.data.environmentalProtection =
      (subArmorPortion.data.environmentalProtection * subScale + armorPortion.data.environmentalProtection * scale) /
      (subScale + scale);
    armorPortion.data.environmentalProtectionWithFilter =
      (subArmorPortion.data.environmentalProtectionWithFilter * subScale +
        armorPortion.data.environmentalProtectionWithFilter * scale) /
      (subScale + scale);
  }

  function addEncumber(armorPortion: ArmorPortion, subArmorPortion: ArmorPortion) {
    armorPortion.data.encumber += subArmorPortion.data.encumber;
    if (subArmorPortion.data.maxEncumber) {
      if (armorPortion.data.maxEncumber) {
        armorPortion.data.maxEncumber += subArmorPortion.data.maxEncumber;
      } else {
        armorPortion.data.maxEncumber = subArmorPortion.data.maxEncumber;
      }
    }
  }

  function consolidateMaterial(
    subArmorPortion: ArmorPortion,
    armorPortion: ArmorPortion,
    subScale: number,
    scale: number
  ) {
    subArmorPortion.data.armorMaterials.forEach((subArmorMaterial) => {
      let materialFound = false;
      armorPortion.data.armorMaterials.forEach(({ data: armorMaterial }) => {
        if (subArmorMaterial.data.id.value.id === armorMaterial.id.value.id) {
          materialFound = true;

          const coverageMultiplier = (subArmorPortion.data.coverage * subScale) / 100;

          armorMaterial.coverage += (subArmorMaterial.data.coverage * coverageMultiplier) / 100;

          armorMaterial.thickness =
            (subScale * subArmorMaterial.data.thickness + scale * armorMaterial.thickness) / (subScale + scale);
        }
      });
      if (!materialFound) {
        const coverageMultiplier = (subArmorPortion.data.coverage * subScale) / 100;

        const newMaterial: ArmorMaterial = JSON.parse(JSON.stringify(subArmorMaterial)) as ArmorMaterial;

        newMaterial.data.coverage = (subArmorMaterial.data.coverage * coverageMultiplier) / 100;
        armorPortion.data.armorMaterials.push(newMaterial);
      }
    });
  }
}

/**
 * scale armorPortions's material
 */
export function scaleAmalgamizedPortion(armorPortions: ArmorPortion[]) {
  armorPortions.forEach(({ data: armorPortion }) => {
    armorPortion.armorMaterials.forEach(({ data: armorMaterial }) => {
      if (armorPortion.coverage == 0) {
        armorMaterial.coverage = 100;
      } else {
        armorMaterial.coverage = Math.round(armorMaterial.coverage / (armorPortion.coverage / 100));
      }
    });
  });
}

/**
 * set all Layer
 */
export function setAllLayer(
  allLayers: CddaItemRef[],
  armorPortions: ArmorPortion[],
  subArmorPortions: ArmorPortion[],
  item: BaseItem
) {
  if (item.hasFlag(Flag.PERSONAL)) {
    allLayers.push(CddaItemRef.new(Flag.PERSONAL, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.SKINTIGHT)) {
    allLayers.push(CddaItemRef.new(Flag.SKINTIGHT, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.NORMAL)) {
    allLayers.push(CddaItemRef.new(Flag.NORMAL, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.WAIST)) {
    allLayers.push(CddaItemRef.new(Flag.WAIST, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.OUTER)) {
    allLayers.push(CddaItemRef.new(Flag.OUTER, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.BELTED)) {
    allLayers.push(CddaItemRef.new(Flag.BELTED, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.AURA)) {
    allLayers.push(CddaItemRef.new(Flag.AURA, CddaType.flag, commonUpdateName));
  }
  if (arrayIsEmpty(allLayers)) {
    allLayers = [CddaItemRef.new(Flag.NORMAL, CddaType.flag, commonUpdateName)];
  }

  armorPortions.forEach(({ data: armorPortion }) => {
    if (arrayIsEmpty(armorPortion.layers)) {
      armorPortion.layers = allLayers;
    } else {
      armorPortion.layers.forEach((protionLayer) => {
        if (!allLayers.some((layer) => layer.value.id === protionLayer.value.id)) {
          allLayers.push(protionLayer);
        }
      });
    }
  });

  subArmorPortions.forEach(({ data: subArmorPortion }) => {
    if (arrayIsEmpty(subArmorPortion.layers)) {
      subArmorPortion.layers = allLayers;
    }
  });
}

export function setFeetRigid(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.map(({ data: subArmorPortion }) => {
    const isNormal = subArmorPortion.layers.some((layer) => layer.value.id === Flag.NORMAL);
    let isLeg = false;
    subArmorPortion.coversSubBodyPart.map((coverSubBodyPart) => {
      const cddaItems = coverSubBodyPart.getCddaItems();
      if (arrayIsNotEmpty(cddaItems)) {
        const subBodyPart = cddaItems[0].getData(new SubBodyPart()) as SubBodyPart;
        if (subBodyPart.data.parent.value.id === 'bp_leg_l' || subBodyPart.data.parent.value.id === 'bp_leg_r')
          isLeg = true;
      }
    });
    if (isNormal && isLeg) {
      subArmorPortion.isRigid = true;
    }
  });
}

/**
 * NonTraditional is soft
 */
export function setNonTraditionalNoRigid(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.forEach(({ data: subArmorPortion }) => {
    if (
      !subArmorPortion.layers.some(
        ({ value: subLayer }) =>
          subLayer.id == Flag.SKINTIGHT || subLayer.id == Flag.NORMAL || subLayer.id == Flag.OUTER
      )
    ) {
      subArmorPortion.isRigid = false;
    }
  });
}

export function setArmorRigidAndComfortable(armor: ArmorInterface) {
  let allRigid = true;
  let allComfortable = true;
  armor.subArmorPortions.forEach(({ data: subArmorPortion }) => {
    allRigid = allRigid && subArmorPortion.isRigid;
    allComfortable = allComfortable && subArmorPortion.isComfortable;
  });
  armor.rigid = allRigid;
  armor.comfortable = allComfortable;
}

export function setBreathability(armorPortions: ArmorPortion[]) {
  const needUpdateArmorPortion = new Array<ArmorPortion>();
  armorPortions.forEach((armorPortion) => {
    if (!armorPortion.data.breathability || armorPortion.data.breathability < 0) {
      needUpdateArmorPortion.push(armorPortion);
    }
  });
  needUpdateArmorPortion.forEach((armorPortion) => {
    const result = armorPortion.data.armorMaterials.map((armorMaterial) => {
      const cddaItems = armorMaterial.data.id.getCddaItems();
      return [cddaItems[0].getData(new Material()) as Material, armorMaterial.data.coverage] as [Material, number];
    });
    const sordMaterial = result.sort((a, b) => a[0].breathability() - b[0].breathability());
    let coverage_counted = 0;
    let combined_breathability = 0;
    for (const material of sordMaterial) {
      combined_breathability += Math.max((material[1] - coverage_counted) * material[0].breathability(), 0);
      coverage_counted = Math.max(material[1], coverage_counted);
      if (coverage_counted == 100) break;
    }
    armorPortion.data.breathability = combined_breathability / 100 + 100 - coverage_counted;
  });
}
