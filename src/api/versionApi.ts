import { api } from 'boot/axios';
import { apiVersion, host } from 'src/constant/apiConstant';
import { Version } from 'src/type';

export async function getVersions(): Promise<Version[]> {
  const response = await api.get(`${host}/${apiVersion}/versions`);
  return response.data;
}
