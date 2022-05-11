import { AsyncId } from 'src/type/common/AsyncId';
import { getArray, getOptionalString } from './baseJsonUtil';
import { parseLengthToCm, parseTimeToS, parseVolumeToMl, parseWeightToG } from 'src/util/dataUtil';
import { getGetTextTransationString } from './getTextUtil';

export async function getOptionalAsyncId(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  asyncUpdateName?: (asyncId: AsyncId) => Promise<void>
): Promise<AsyncId | undefined> {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return AsyncId.new(field, type, asyncUpdateName);
  } else {
    return undefined;
  }
}

export async function getAsyncId(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  asyncUpdateName?: (asyncId: AsyncId) => Promise<void>,
  def?: AsyncId
): Promise<AsyncId> {
  return (await getOptionalAsyncId(jsonObject, key, type, asyncUpdateName)) ?? def ?? new AsyncId();
}

export async function getAsyncIds(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  asyncUpdateName?: (asyncId: AsyncId) => Promise<void>
): Promise<AsyncId[]> {
  return await Promise.all(
    getArray(jsonObject, key, []).map(async (value) => await AsyncId.new(<string>value, type, asyncUpdateName))
  );
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
