interface GetTextTransation {
  str?: string;
  str_sp?: string;
  str_pl?: string;
  male?: string;
  female?: string;

  ctxt?: string;
}

export function parseGetTextTransation(value: unknown): GetTextTransation | undefined {
  const type = typeof value;
  if (type === 'string') {
    return { str: value as string };
  } else if (type === 'object') {
    return value as GetTextTransation;
  }
}

export function convertGetTextTransationString(value: GetTextTransation | undefined): string {
  if (!value) {
    return 'null';
  }
  return value.str ?? value.str_sp ?? value.str_pl ?? value.male ?? value.female ?? 'null';
}

export function getGetTextTransationString(value: unknown): string {
  return convertGetTextTransationString(parseGetTextTransation(value));
}
