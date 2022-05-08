export function instanceOfJsonItem(value: object): boolean {
  return 'type' in value && 'jsonId' in value && '_id' in value;
}
