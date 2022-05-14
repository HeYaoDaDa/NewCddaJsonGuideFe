import { getVersions } from 'src/api/versionApi';
import { KEY_LATEST_VERSION_ID } from 'src/constant/dataConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { Version } from 'src/type';

export async function normalizeVersionId(versionId: string) {
  if (versionId === KEY_LATEST_VERSION_ID) {
    const versions = await getVersions();
    return versions.reduce((latest, current) => (latest.publishDate > current.publishDate ? latest : current))._id;
  }
  return versionId;
}

export async function updateVersions(version: Version[]) {
  const newVersions = await getVersions();
  const userConfig = useUserConfigStore();
  version.splice(0, version.length, ...newVersions);
  userConfig.updateVersion(version);
}
