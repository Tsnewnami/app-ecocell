export interface Paddock{
  index: number;
  soilData: number[];
  weatherData: number[];
  polygonApiId: string;
  healthStatus: string;
  nvdiData: number[];
}

export function comparePaddock(pD1: Paddock, pD2:Paddock) {

  const compare = pD1.index - pD2.index;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }

  else return 0;
}
