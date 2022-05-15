import PocketDataFieldSet from 'src/components/loaderView/card/item/PocketDataFieldSet.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray, getBoolean, getNumber, getOptionalObject, getString } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty, stringIsEmpty } from 'src/util/commonUtil';
import {
  getCddaItemRefs,
  getLength,
  getOptionalCddaItemRef,
  getOptionalVolume,
  getTranslationString,
  getVolume,
  getWeight,
} from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';
export class PocketData extends SuperLoader<PocketDataInterface> {
  doToView(result: VNode[]): void {
    result.push(h(PocketDataFieldSet, { cddaData: this }));
  }

  doLoad(data: PocketDataInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: PocketDataInterface, jsonObject: Record<string, unknown>) {
    data.pocketType = getString(jsonObject, 'pocket_type', PocketType.CONTAINER);
    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');

    data.flagRestrictions = getCddaItemRefs(jsonObject, 'flag_restriction', CddaType.flag, commonUpdateName);
    data.allowedSpeedloaders = getCddaItemRefs(jsonObject, 'allowed_speedloaders', CddaType.item, commonUpdateName);
    data.itemIdRestriction = getCddaItemRefs(jsonObject, 'item_restriction', CddaType.item, commonUpdateName);
    data.defaultMagazine = getOptionalCddaItemRef(jsonObject, 'default_magazine', CddaType.item, commonUpdateName);
    if (arrayIsNotEmpty(data.itemIdRestriction) && stringIsEmpty(data.defaultMagazine?.value.id)) {
      data.defaultMagazine = data.itemIdRestriction[0];
    }
    data.ammoRestriction = getArray(jsonObject, 'ammo_restriction', []).map((value) => {
      const temp = value as [string, number];
      return [CddaItemRef.new(temp[0], CddaType.ammo, commonUpdateName), temp[1]];
    });

    if (arrayIsEmpty(data.ammoRestriction)) {
      data.minItemVolume = getVolume(jsonObject, 'min_item_volume');
      data.maxItemVolume = getOptionalVolume(jsonObject, 'max_item_volume');
      data.volumeCapacity = getVolume(jsonObject, 'max_contains_volume', 200000 * 1000);
      data.weightCapacity = getWeight(jsonObject, 'max_contains_weight', 200000 * 1000 * 1000);
      data.maxItemLength = getLength(jsonObject, 'max_item_length', Math.round(Math.cbrt(data.volumeCapacity)));
      data.minItemLength = getLength(jsonObject, 'min_item_length');
      data.extraEncumbrance = getNumber(jsonObject, 'extra_encumbrance');
      data.volumeEncumberModifier = getNumber(jsonObject, 'volume_encumber_modifier', 1);
      data.ripoff = getNumber(jsonObject, 'ripoff');

      data.spoilMultiplier = getNumber(jsonObject, 'spoil_multiplier', 1);
      data.weightMultiplier = getNumber(jsonObject, 'weight_multiplier', 1);
      data.volumeMultiplier = getNumber(jsonObject, 'volume_multiplier', 1);

      data.magazineWell = getVolume(jsonObject, 'magazine_well');
      data.moves = getNumber(jsonObject, 'moves', 100);

      data.fireProtection = getBoolean(jsonObject, 'fire_protection');
      data.watertight = getBoolean(jsonObject, 'watertight');
      data.airtight = getBoolean(jsonObject, 'airtight');
      data.openContainer = getBoolean(jsonObject, 'open_container');
      data.rigid = getBoolean(jsonObject, 'rigid');
      data.holster = getBoolean(jsonObject, 'holster');
      data.ablative = getBoolean(jsonObject, 'ablative');
      if (data.ablative) {
        data.holster = true;
      }
      const activityNoiseObject = getOptionalObject(jsonObject, 'activity_noise') as
        | Record<string, unknown>
        | undefined;
      if (activityNoiseObject) {
        data.activityNoise = {
          volume: getVolume(activityNoiseObject, 'volume'),
          chance: getNumber(activityNoiseObject, 'chance'),
        };
      }
      const sealedDataObject = getOptionalObject(jsonObject, 'sealed_data') as Record<string, unknown> | undefined;
      if (sealedDataObject) {
        data.sealedData = { spoilMultiplier: getNumber(sealedDataObject, 'spoil_multiplier', 1) };
      }
    }
  }
}

export interface PocketDataInterface {
  pocketType: string;
  description: string;
  name: string;

  volumeCapacity: number;
  weightCapacity: number;

  maxItemVolume?: number;
  minItemVolume: number;

  maxItemLength: number;
  minItemLength: number;

  extraEncumbrance: number;
  volumeEncumberModifier: number;
  ripoff: number;
  activityNoise?: PocketNoiseInterface;
  spoilMultiplier: number;
  weightMultiplier: number;
  volumeMultiplier: number;
  magazineWell: number;
  moves: number;
  sealedData?: SealableDataInterface;

  ammoRestriction: [CddaItemRef, number][];
  allowedSpeedloaders: CddaItemRef[];
  flagRestrictions: CddaItemRef[];
  itemIdRestriction: CddaItemRef[];
  defaultMagazine?: CddaItemRef;

  openContainer: boolean;
  holster: boolean;
  ablative: boolean;
  fireProtection: boolean;
  watertight: boolean;
  airtight: boolean;
  rigid: boolean;
}

interface PocketNoiseInterface {
  volume: number;
  chance: number;
}

interface SealableDataInterface {
  spoilMultiplier: number;
}

export enum PocketType {
  CONTAINER = 'CONTAINER',
  MAGAZINE = 'MAGAZINE',
  MAGAZINE_WELL = 'MAGAZINE_WELL', //holds magazines
  MOD = 'MOD', // the gunmods or toolmods
  CORPSE = 'CORPSE', // the "corpse" pocket - bionics embedded in a corpse
  SOFTWARE = 'SOFTWARE', // software put into usb or some such
  EBOOK = 'EBOOK', // holds electronic books for a device or usb
  MIGRATION = 'MIGRATION', // this allows items to load contents that are too big, in order to spill them later.
  LAST = 'LAST',
}
