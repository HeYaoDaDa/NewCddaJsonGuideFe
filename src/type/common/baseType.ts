export interface Version {
  _id: string;
  releaseId: string;
  releaseDescribe: string;
  targetCommit: string;
  branch: number;
  createDate: Date;
  publishDate: Date;
  tagName: string;
  tagMessage: string;
  tagDate: Date;
}

export interface JsonItem {
  _id: string;
  jsonId: string;
  type: string;
  isOriginal: boolean;
  startVersion: Version;
  endVersion: Version;
  language: string;
  path: string;
  mod: string;
  content: object;
  originalContent: object;
}
