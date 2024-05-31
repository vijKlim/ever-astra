
export interface IBaseSoftDeleteEntityModel {
  deletedAt?: Date;
}
export interface IBaseEntityModel extends IBaseSoftDeleteEntityModel  {
  id?: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
