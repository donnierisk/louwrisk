import { GridPosition } from './GridPosition';
import { Entity } from '@/models/Entity/Entity';
import { GridBlockI } from './GridBlockI';

export interface InspectedObjectI {
    position: GridPosition,
    gridBlock?: GridBlockI,
    entity?: Entity
}
