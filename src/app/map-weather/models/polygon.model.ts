export interface Polygon{
  index: number;
  userId: string;
  name: string;
  lat: number[];
  long: number[];
  fillColor: string;
  polygonApiId: string
}

export interface RenderedPolygon{
  index: number;
  polygon: google.maps.Polygon
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
