export const spriteConfig: ISpriteTerrainConfig = {
    grass: {
        x: '0px', y: '0px',
    },
    grass1: {
        x: '0', y: '-128px',
    },
    water: {
        x: '0', y: '-256px',
    },
    ground: {
        x: '0px', y: '0px'
    },
    empty: {
        x: '0px', y: '0px'
    }
}

export interface ISpriteTerrainConfig {
    [key: string]: ISpriteTerrainMeta
}

export interface ISpriteTerrainMeta {
    x: string,
    y: string
}

// THESE ARE MADE NEGATIVE AND HALF OF ORIGINAL SPRITESHEET SIZE.
// THIS IS PROBABLY BASED ON GRID WIDTH OR SOMETHING IN SPRITEBLOCK
// NEED TO PROVIDE ORIGINAL VALUES HERE THEN LET JS DO THE CONVERSION AND I AM A POOP HEAD
