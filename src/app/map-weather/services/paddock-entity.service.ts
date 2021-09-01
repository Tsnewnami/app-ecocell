import { Paddock } from './../models/paddock.model';
import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class PaddockEntityService extends EntityCollectionServiceBase<Paddock>{
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory){
    super('Paddock', serviceElementsFactory)
  }
}
