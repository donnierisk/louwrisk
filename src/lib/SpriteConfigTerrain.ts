export const spriteConfig: ISpriteTerrainConfig = {
    sheetSize: { x: 1280, y: 768 },
    blockSize: {
        x: 256, y: 256, unit: 'px'
    },
    terrains: {
        grass: {
            x: 0, y: 0,
        },
        grass1: {
            x: 0, y: -1,
        },
        water: {
            x: 0, y: -2,
        },
        ground: {
            x: 0, y: 0
        },
        mud: {
            x: -1, y: 0
        },
        empty: {
            x: 0, y: 0
        }
    },
}

export interface ISpriteTerrainConfig {
    sheetSize: { x: number, y: number },
    blockSize: { x: number, y: number, unit: string },
    terrains: { [key: string]: ISpriteTerrainMeta }
}

export interface ISpriteTerrainMeta {
    x: number,
    y: number
}

// THESE ARE MADE NEGATIVE AND HALF OF ORIGINAL SPRITESHEET SIZE.
// THIS IS PROBABLY BASED ON GRID WIDTH OR SOMETHING IN SPRITEBLOCK
// NEED TO PROVIDE ORIGINAL VALUES HERE THEN LET JS DO THE CONVERSION AND I AM A POOP HEAD
