export function arrayIsEmpty(value: Array<unknown> | undefined): boolean {
  return value == undefined || value.length === 0;
}

export function arrayIsNotEmpty(value: Array<unknown> | undefined): boolean {
  return !arrayIsEmpty(value);
}

export function stringIsEmpty(value: string | undefined): boolean {
  return value == undefined || value.length === 0;
}

export function stringIsNotEmpty(value: string | undefined): boolean {
  return !stringIsEmpty(value);
}
