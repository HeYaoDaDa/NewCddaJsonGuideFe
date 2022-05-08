import { BodyFactory } from 'src/type/loaderFactory/bodyPart/BodyFactory';
import { SubBodyFactory } from 'src/type/loaderFactory/bodyPart/SubBodyFactory';
import { DummyFactory } from 'src/type/loaderFactory/DummyFactory';
import { SuperFactory } from 'src/type/loaderFactory/SuperFactory';

export const loaderFactorys: SuperFactory[] = [new SubBodyFactory(), new BodyFactory(), new DummyFactory()];
