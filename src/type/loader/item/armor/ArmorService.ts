import { CddaType } from 'src/constant/cddaType';
import { Flag } from 'src/constant/FlagsContant';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { cloneObject } from 'src/util/cloneObject';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
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
export async function inferSubArmorPortionsArmorMaterial(
  jsonItem: JsonItem,
  subArmorPortions: ArmorPortion[],
  item: BaseItem
) {
  await Promise.all(
    subArmorPortions
      .filter((subArmorPortion) => arrayIsEmpty(subArmorPortion.data.armorMaterials))
      .map(async (subArmorPortion) => {
        const skipScale: boolean = item.data.materialPortionsTotal === 0;
        await Promise.all(
          item.data.materials.map(async (itemMaterial) => {
            const armorMaterial = new ArmorMaterial();
            if (skipScale) {
              await armorMaterial.load(jsonItem, {
                type: itemMaterial[0].value.id,
                thickness: item.data.materials.length * subArmorPortion.data.avgThickness,
                ignore_sheet_thickness: true,
              });
            } else {
              await armorMaterial.load(jsonItem, {
                type: itemMaterial[0].value.id,
                thickness: (itemMaterial[1] / item.data.materialPortionsTotal) * subArmorPortion.data.avgThickness,
                ignore_sheet_thickness: true,
              });
            }
            subArmorPortion.data.armorMaterials.push(armorMaterial);
          })
        );
      })
  );
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

export async function setSubArmorPotionsrRigidComfortable(subArmorPortions: ArmorPortion[]) {
  await Promise.all(
    subArmorPortions.map((subArmorPortion) =>
      Promise.all(
        subArmorPortion.data.armorMaterials
          .filter((armorMaterial) => armorMaterial.data.coverage > 40)
          .map((armorMaterial) =>
            armorMaterial.data.id.getCddaItems().then(async (cddaItems) => {
              if (arrayIsNotEmpty(cddaItems)) {
                const material = (await cddaItems[0].getData(new Material())) as Material;
                if (material.data.soft) {
                  subArmorPortion.data.isComfortable = true;
                } else {
                  subArmorPortion.data.isRigid = true;
                }
              }
            })
          )
      )
    )
  );
}

/**
 * consolidate SubArmorPotions to ArmorPotions
 */
export async function consolidateSubArmorPotions(armorPortions: ArmorPortion[], subArmorPortions: ArmorPortion[]) {
  await Promise.all(
    subArmorPortions
      .filter((subArmorPortion) => arrayIsNotEmpty(subArmorPortion.data.coversBodyPart))
      .map(async (subArmorPortion) => {
        await Promise.all(
          subArmorPortion.data.coversBodyPart.map(async (subCover) => {
            let found = false;

            await Promise.all(
              armorPortions
                .filter((armorPortion) =>
                  armorPortion.data.coversBodyPart.some((bodyPartId) => bodyPartId.value.id === subCover.value.id)
                )
                .map(async (armorPortion) => {
                  found = true;
                  addEncumber(armorPortion, subArmorPortion);

                  let [subScale, scale] = await Promise.all([
                    subArmorPortion.maxCoverage(subCover.value.id),
                    armorPortion.maxCoverage(subCover.value.id),
                  ]);
                  subScale *= 0.01;
                  scale *= 0.01;

                  consolidatePortionBaseInfo(armorPortion, subArmorPortion, subScale, scale);
                  consolidateMaterial(subArmorPortion, armorPortion, subScale, scale);
                  consolidateLayerAndSubBodyPart(subArmorPortion, armorPortion);
                })
            );

            if (!found) {
              const newArmorPortion = getNewArmorPotrtion(subArmorPortion, subCover);
              armorPortions.push(newArmorPortion);
            }
          })
        );
      })
  );

  function getNewArmorPotrtion(subArmorPortion: ArmorPortion, subCover: AsyncId) {
    const newArmorPortion = cloneObject(subArmorPortion);
    newArmorPortion.data.coversBodyPart = [subCover];
    // ??? no clear coversSubBodyPart ???
    void newArmorPortion.maxCoverage(subCover.value.id).then((maxCoverage) => {
      const scale = maxCoverage * 0.01;
      newArmorPortion.data.coverage *= scale;
      newArmorPortion.data.coverageMelee *= scale;
      newArmorPortion.data.coverageRanged *= scale;
    });
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
export async function setAllLayer(
  allLayers: AsyncId[],
  armorPortions: ArmorPortion[],
  subArmorPortions: ArmorPortion[],
  item: BaseItem
) {
  if (item.hasFlag(Flag.PERSONAL)) {
    allLayers.push(await AsyncId.new(Flag.PERSONAL, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.SKINTIGHT)) {
    allLayers.push(await AsyncId.new(Flag.SKINTIGHT, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.NORMAL)) {
    allLayers.push(await AsyncId.new(Flag.NORMAL, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.WAIST)) {
    allLayers.push(await AsyncId.new(Flag.WAIST, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.OUTER)) {
    allLayers.push(await AsyncId.new(Flag.OUTER, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.BELTED)) {
    allLayers.push(await AsyncId.new(Flag.BELTED, CddaType.flag, commonUpdateName));
  }
  if (item.hasFlag(Flag.AURA)) {
    allLayers.push(await AsyncId.new(Flag.AURA, CddaType.flag, commonUpdateName));
  }
  if (arrayIsEmpty(allLayers)) {
    allLayers = [await AsyncId.new(Flag.NORMAL, CddaType.flag, commonUpdateName)];
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

export async function setFeetRigid(subArmorPortions: ArmorPortion[]) {
  await Promise.all(
    subArmorPortions.map(async ({ data: subArmorPortion }) => {
      const isNormal = subArmorPortion.layers.some((layer) => layer.value.id === Flag.NORMAL);
      let isLeg = false;
      await Promise.all(
        subArmorPortion.coversSubBodyPart.map(async (coverSubBodyPart) => {
          const cddaItems = await coverSubBodyPart.getCddaItems();
          if (arrayIsNotEmpty(cddaItems)) {
            const subBodyPart = (await cddaItems[0].getData(new SubBodyPart())) as SubBodyPart;
            if (subBodyPart.data.parent.value.id === 'bp_leg_l' || subBodyPart.data.parent.value.id === 'bp_leg_r')
              isLeg = true;
          }
        })
      );
      if (isNormal && isLeg) {
        subArmorPortion.isRigid = true;
      }
    })
  );
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

export async function setBreathability(armorPortions: ArmorPortion[]) {
  const needUpdateArmorPortion = new Array<ArmorPortion>();
  armorPortions.forEach((armorPortion) => {
    if (!armorPortion.data.breathability || armorPortion.data.breathability < 0) {
      needUpdateArmorPortion.push(armorPortion);
    }
  });
  await Promise.all(
    needUpdateArmorPortion.map(async (armorPortion) => {
      const result = await Promise.allSettled(
        armorPortion.data.armorMaterials.map(async (armorMaterial) => {
          const cddaItems = await armorMaterial.data.id.getCddaItems();
          return [(await cddaItems[0].getData(new Material())) as Material, armorMaterial.data.coverage] as [
            Material,
            number
          ];
        })
      );
      const newResult = result
        .filter((item) => item.status === 'fulfilled')
        .map((item) => (item.status === 'fulfilled' ? item.value : <[Material, number]>{}));
      const sordMaterial = newResult.sort((a, b) => a[0].breathability() - b[0].breathability());
      let coverage_counted = 0;
      let combined_breathability = 0;
      for (const material of sordMaterial) {
        combined_breathability += Math.max((material[1] - coverage_counted) * material[0].breathability(), 0);
        coverage_counted = Math.max(material[1], coverage_counted);
        if (coverage_counted == 100) break;
      }
      armorPortion.data.breathability = combined_breathability / 100 + 100 - coverage_counted;
    })
  );
}
