export const spriteConfig: ISpriteConfig = {
    player: {
        pos: { x: '0px', y: '0px' },
        gridSpan: { x: 1, y: 1 },
        sourceBlock: { x: 0, y: 0 }
    },
    crate1: {
        pos: { x: '-128px', y: '0px' },
        gridSpan: { x: 1, y: 1 },
        sourceBlock: { x: 0, y: 0 }
    },
    bandit: {
        pos: { x: '-128px', y: '-128px' },
        gridSpan: { x: 1, y: 1 },
        sourceBlock: { x: 0, y: 0 }
    },
    rock: {
        pos: { x: '-128px', y: '-256px' },
        gridSpan: { x: 1, y: 1 },
        sourceBlock: { x: 0, y: 0 }
    },
    tree: {
        pos: { x: '-256px', y: '0px' },
        gridSpan: { x: 3, y: 3 },
        sourceBlock: { x: 1, y: 2 }
    },
    wagon: {
        pos: { x: '0px', y: '-384px' },
        gridSpan: { x: 2, y: 2 },
        sourceBlock: { x: 0, y: 1 }
    }
}

export interface ISpriteConfig {
    [key: string]: ISpriteMeta
}

export interface ISpriteMeta {
    pos: {
        x: string,
        y: string
    },
    gridSpan: {
        x: number,
        y: number
    },
    sourceBlock: {
        x: number,
        y: number
    }
}

// THESE ARE MADE NEGATIVE AND HALF OF ORIGINAL SPRITESHEET SIZE.
// THIS IS PROBABLY BASED ON GRID WIDTH OR SOMETHING IN SPRITEBLOCK
// NEED TO PROVIDE ORIGINAL VALUES HERE THEN LET JS DO THE CONVERSION AND I AM A POOP HEAD
