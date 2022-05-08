import { SubBodyFactory } from 'src/type/loaderFactory/bodyPart/SuperFactory';
import { DummyFactory } from 'src/type/loaderFactory/DummyFactory';
import { SuperFactory } from 'src/type/loaderFactory/SuperFactory';

export const loaderFactorys: SuperFactory[] = [
  new SubBodyFactory(),
  new DummyFactory(),
];
