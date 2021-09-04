import { map, Observable } from 'rxjs';
import { PaddockEntityService } from './../../../services/paddock-entity.service';
import { Component, Input, OnInit } from '@angular/core';
import { Polygon } from 'src/app/map-weather/models/polygon.model';
import { Paddock } from 'src/app/map-weather/models/paddock.model';

@Component({
  selector: 'app-paddock-details',
  templateUrl: './paddock-details.component.html',
  styleUrls: ['./paddock-details.component.css']
})
export class PaddockDetailsComponent implements OnInit {
  @Input()
  polygon: Polygon;

  paddockDetail$: Observable<Paddock>;

  paddockDetail: Paddock

  constructor(private paddockEntityService: PaddockEntityService) { }

  ngOnInit(): void {
    this.paddockDetail$ = this.paddockEntityService.entities$
        .pipe(
          map(paddockDetails => paddockDetails.find(paddock => paddock.index == this.polygon.index))
        )

    this.paddockDetail$.subscribe(res => {
      this.paddockDetail = res;
    })

    console.log(this.paddockDetail);
  }

}
