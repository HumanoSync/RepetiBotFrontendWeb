import { ServoResource } from "./ServoResource";

export interface CreatePositionRequest{
    delay:number,
    angles: ServoResource[],
    movement_id: number
}
  