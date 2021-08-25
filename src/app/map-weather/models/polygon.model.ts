export interface Polygon{
  index: number;
  userId: string;
  name: string;
  lat: number[];
  long: number[];
  dialog?: google.maps.InfoWindow;
}

export function comparePolygons(p1:Polygon, p2:Polygon) {

  const compare = p1.index - p2.index;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
