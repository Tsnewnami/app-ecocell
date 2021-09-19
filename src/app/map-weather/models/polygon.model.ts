export interface Polygon{
  index: number;
  userId: string;
  name: string;
  lat: number[];
  long: number[];
  fillColor: string;
  outlineColor: string;
  polygonApiId: string;
  polyArea: number;
  paddockType: string;
  paddockFillType: string;
  cattleCount: number[];
}

export interface RenderedPolygon{
  index: number;
  polygon: google.maps.Polygon;
  marker: google.maps.Marker;
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
