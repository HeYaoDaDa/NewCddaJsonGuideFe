import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { Translation } from 'src/type/common/Translation';
import { parseLengthToCm, parseTimeToS, parseVolumeToMl, parseWeightToG } from 'src/util/dataUtil';
import { getArray, getOptionalString } from './baseJsonUtil';
import { getGetTextTransationString } from './getTextUtil';

export function getOptionalCddaItemRef(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  updateNameFunc?: (cddaItemRef: CddaItemRef) => void
): CddaItemRef | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return CddaItemRef.new(field, type, updateNameFunc);
  } else {
    return undefined;
  }
}

export function getCddaItemRef(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  updateNameFunc?: (cddaItemRef: CddaItemRef) => void,
  def?: CddaItemRef
): CddaItemRef {
  return getOptionalCddaItemRef(jsonObject, key, type, updateNameFunc) ?? def ?? new CddaItemRef();
}

export function getCddaItemRefs(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  updateNameFunc?: (cddaItemRef: CddaItemRef) => void
): CddaItemRef[] {
  return getArray(jsonObject, key, []).map((value) => CddaItemRef.new(<string>value, type, updateNameFunc));
}

export function getOptionalWeight(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseWeightToG(field);
  } else {
    return undefined;
  }
}

export function getWeight(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalWeight(jsonObject, key) ?? def ?? 0;
}

export function getOptionalVolume(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseVolumeToMl(field);
  } else {
    return undefined;
  }
}

export function getVolume(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalVolume(jsonObject, key) ?? def ?? 0;
}

export function getOptionalLength(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseLengthToCm(field);
  } else {
    return undefined;
  }
}

export function getLength(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalLength(jsonObject, key) ?? def ?? 0;
}

export function getOptionalTime(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseTimeToS(field);
  } else {
    return undefined;
  }
}

export function getTime(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalTime(jsonObject, key) ?? def ?? 0;
}

export function getOptionalTranslationString(jsonObject: Record<string, unknown>, key: string): string | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result !== 'object') {
      return result as string;
    } else {
      if (Array.isArray(result)) {
        return (<string[]>result)[0];
      }
      return getGetTextTransationString(result);
    }
  } else {
    return undefined;
  }
}

export function getTranslationString(jsonObject: Record<string, unknown>, key: string, def?: string): string {
  return getOptionalTranslationString(jsonObject, key) ?? def ?? '';
}

export function getOptionalTranslation(
  jsonObject: Record<string, unknown>,
  key: string,
  ctxt: string
): Translation | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return new Translation(field, ctxt);
  } else {
    return undefined;
  }
}

export function getTranslation(
  jsonObject: Record<string, unknown>,
  key: string,
  ctxt: string,
  def?: Translation
): Translation {
  return getOptionalTranslation(jsonObject, key, ctxt) ?? def ?? new Translation('null', '');
}

export function getTranslations(jsonObject: Record<string, unknown>, key: string, ctxt: string): Translation[] {
  return getArray(jsonObject, key).map((obj) => new Translation(obj as string, ctxt));
}
