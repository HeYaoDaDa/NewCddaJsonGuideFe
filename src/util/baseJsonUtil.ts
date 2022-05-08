export function getOptionalUnknown(
  jsonObject: Record<string, unknown>,
  key: string
): unknown | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    return jsonObject[key];
  } else {
    return undefined;
  }
}

export function getOptionalObject(
  jsonObject: Record<string, unknown>,
  key: string
): object | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (result && typeof result === 'object') {
      return result;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getOptionalArray(
  jsonObject: Record<string, unknown>,
  key: string
): Array<unknown> | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (Array.isArray(result)) {
      return result as Array<unknown>;
    } else {
      return [result];
    }
  } else {
    return undefined;
  }
}

export function getArray(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: Array<unknown>
): Array<unknown> {
  return getOptionalArray(jsonObject, key) ?? def ?? [];
}

export function getOptionalString(
  jsonObject: Record<string, unknown>,
  key: string
): string | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'string' || typeof result === 'number') {
      return result as string;
    } else {
      console.warn(
        'getOptionalString is no string jsonObject: %o, key: %s, result: %s',
        jsonObject,
        key,
        result
      );
      return result as string;
    }
  } else {
    return undefined;
  }
}

export function getString(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: string
): string {
  return getOptionalString(jsonObject, key) ?? def ?? '';
}

export function getOptionalNumber(
  jsonObject: Record<string, unknown>,
  key: string
): number | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'number') {
      return result;
    } else {
      console.warn(
        'getOptionalNumber is no string jsonObject: %o, key: %s, result: %s',
        jsonObject,
        key,
        result
      );
      return result as number;
    }
  } else {
    return undefined;
  }
}

export function getNumber(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: number
): number {
  return getOptionalNumber(jsonObject, key) ?? def ?? 0;
}

export function getOptionalBoolean(
  jsonObject: Record<string, unknown>,
  key: string
): boolean | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'boolean') {
      return result;
    } else {
      console.warn(
        'getOptionalBoolean is no string jsonObject: %o, key: %s, result: %s',
        jsonObject,
        key,
        result
      );
      return false;
    }
  } else {
    return undefined;
  }
}

export function getBoolean(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: boolean
): boolean {
  return getOptionalBoolean(jsonObject, key) ?? def ?? false;
}
