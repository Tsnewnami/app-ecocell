import { GoogleMapsService } from './../../services/google-maps.service';
import { FarmEntityService } from './../../services/farm-entity.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Polygon } from 'src/app/map-weather/models/polygon.model';
import { Farm } from '../../models/farm.model';

@Component({
  selector: 'app-farm-dialog',
  templateUrl: './farm-dialog.component.html',
  styleUrls: ['./farm-dialog.component.css']
})
export class FarmDialogComponent implements OnInit {
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  private farms: Farm[];
  private latLong: number[];
  private address: string;

  autocompleteInput: string;
  queryWait: boolean;
  farms$: Observable<Farm[]>;
  farmNameC: string;
  duplicateFound: boolean = false;
  validRegion: boolean = false;



  constructor(
    private farmEntityService: FarmEntityService,
    public dialogRef: MatDialogRef<FarmDialogComponent>) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.farms$ = this.farmEntityService.entities$;
    this.farms$
      .subscribe(res => {
        this.farms = res;
      })
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  validation(name: string) {
    this.farms.forEach(farm => {
      if (farm.name.replace(/^\s+|\s+$/g, '') === name.trim()) {
        console.log(farm.name);
        this.duplicateFound = true; // now your error will be displayed in browser
      } else{
        this.duplicateFound = false;
      }
    });
  }

  validationRegion(){
    this.validRegion = false;
  }

  onClose(farmName: string): void {
    this.dialogRef.close([this.latLong, farmName, this.address]);
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
            componentRestrictions: { country: 'AUS' },
            types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
        });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.address = place.formatted_address.replace(', Australia','');
        this.latLong = [place.geometry.location.lat(), place.geometry.location.lng()]
        this.validRegion = true;
        this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

}
