import { api } from 'boot/axios';
import { API_VERSION, HOST } from 'src/constant/apiConstant';
import { Version } from 'src/type';

export async function getVersions(): Promise<Version[]> {
  const response = await api.get(`${HOST}/${API_VERSION}/versions`);
  return response.data;
}
