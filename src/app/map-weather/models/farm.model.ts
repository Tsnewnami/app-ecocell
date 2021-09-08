export interface Farm{
  index: number;
  name: string;
  region: string;
  regionLat: number;
  regionLong: number;
}

export function compareFarms(f1:Farm, f2:Farm) {

  const compare = f1.index - f2.index;

  if (compare > 0) {
    return 1;
  }
  else if ( compare < 0) {
    return -1;
  }
  else return 0;

}
