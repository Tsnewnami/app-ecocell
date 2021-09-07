import { Farm } from './../models/farm.model';
import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class FarmEntityService extends EntityCollectionServiceBase<Farm>{
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory){
    super('Farm', serviceElementsFactory)
  }
}
