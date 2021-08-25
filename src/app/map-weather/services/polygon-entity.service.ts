import { Polygon } from '../models/polygon.model';
import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class PolygonEntityService extends EntityCollectionServiceBase<Polygon>{
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory){
    super('Polygon', serviceElementsFactory)
  }
}
