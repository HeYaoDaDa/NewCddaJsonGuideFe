import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/type/common/CddaItem';
import { SuperLoader } from '../loader/baseLoader/SuperLoader';

export abstract class SuperFactory {
  loaders: Array<SuperLoader<object>> = [];

  abstract validate(cdddaItem: CddaItem): boolean;

  getLoader(): SuperLoader<object> | undefined {
    const userConfig = useUserConfigStore();
    const loader = this.loaders.find((loader) => loader.validateVersion(userConfig.version));
    if (loader) {
      return new (Object.getPrototypeOf(loader).constructor)();
    }
  }
}
