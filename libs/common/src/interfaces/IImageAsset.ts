import {FileStorageProviderEnum} from "../enums/FileStorageProviderEnum";
import {IBaseEntityModel} from "./IBaseEntity";

export interface IRelationalImageAsset {
  image?: IImageAsset | null;
  imageId?: IImageAsset['id'] | null;
}

export interface IImageAsset extends IImageAssetCreateInput {
  fullUrl?: string;
  thumbUrl?: string;
}

export interface IImageAssetCreateInput extends IBaseEntityModel{
  name: string;
  url: string;
  thumb?: string;
  width?: number;
  height?: number;
  size?: number;
  isFeatured?: boolean;
  externalProviderId?: string;
  storageProvider?: FileStorageProviderEnum;
}
