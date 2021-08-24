export interface Polygon{
  index: number;
  userId: string;
  name: string;
  lat: number[];
  long: number[];
  dialog?: google.maps.InfoWindow;
}
