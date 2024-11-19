import { ServoResource } from "./ServoResource";

export interface PositionResource{
    delay: number, 
    angles: ServoResource[],
    movement_id: number
}
  