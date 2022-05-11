import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { JsonItem } from 'src/type/common/baseType';
import { getString } from 'src/util/baseJsonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';
export class ToHit extends SuperLoader<ToHitInterface> {
  async doLoad(data: ToHitInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    const data = this.data;
    result.push(h(MyField, { label: 'toHit' }, () => h(MyText, { content: data.numberToHit })));
    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: ToHitInterface, jsonObject: object) {
    if (typeof jsonObject === 'number') {
      data.numberToHit = jsonObject;
      jsonObject = {};
    }
    data.grip = getString(jsonObject as Record<string, unknown>, 'grip', ToHitGrip[ToHitGrip.weapon]);
    data.length = getString(jsonObject as Record<string, unknown>, 'length', ToHitLength[ToHitLength.hand]);
    data.surface = getString(jsonObject as Record<string, unknown>, 'surface', ToHitSurface[ToHitSurface.any]);
    data.balance = getString(jsonObject as Record<string, unknown>, 'balance', ToHitBalance[ToHitBalance.neutral]);
    if (!data.numberToHit) {
      data.numberToHit = numToHitObject(data);
    }
  }
}

export interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
  numberToHit: number;
}

export enum ToHitGrip {
  bad = 0,
  none = 1,
  solid = 2,
  weapon = 3,
  last = 4,
}

function stringToGrip(value: string) {
  switch (value) {
    case 'bad':
      return 0;
    case 'none':
      return 1;
    case 'solid':
      return 2;
    case 'weapon':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitLength {
  hand = 0,
  short = 1,
  long = 2,
  last = 3,
}

function stringToLength(value: string) {
  switch (value) {
    case 'hand':
      return 0;
    case 'short':
      return 1;
    case 'long':
      return 2;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitSurface {
  point = 0,
  line = 1,
  any = 2,
  every = 3,
  last = 4,
}

function stringToSurface(value: string) {
  switch (value) {
    case 'point':
      return 0;
    case 'line':
      return 1;
    case 'any':
      return 2;
    case 'every':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitBalance {
  clumsy = 0,
  uneven = 1,
  neutral = 2,
  good = 3,
  last = 4,
}

function stringToBalance(value: string) {
  switch (value) {
    case 'clumsy':
      return 0;
    case 'uneven':
      return 1;
    case 'neutral':
      return 2;
    case 'good':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export function numToHitObject(value: ToHitInterface) {
  return (
    stringToBalance(value.balance) +
    stringToGrip(value.grip) +
    stringToLength(value.length) +
    stringToSurface(value.surface) -
    7
  );
}
