export const spriteConfig: ISpriteConfig = {
    sheetSize: { x: 1792, y: 1280 },
    blockSize: {
        x: 256, y: 256, unit: 'px'
    },
    entities: {
        player: {
            pos: { x: 0, y: 0 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 }
        },
        crate1: {
            pos: { x: -1, y: 0 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 }
        },
        bandit: {
            pos: { x: -1, y: -1 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 }
        },
        rock: {
            pos: { x: -1, y: -2 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 }
        },
        tree: {
            pos: { x: -2, y: 0 },
            gridSpan: { x: 3, y: 3 },
            sourceBlock: { x: 1, y: 2 }
        },
        wagon: {
            pos: { x: 0, y: -3 },
            gridSpan: { x: 2, y: 2 },
            sourceBlock: { x: 0, y: 1 }
        }
    }
}

export interface ISpriteConfig {
    sheetSize: { x: number, y: number },
    blockSize: { x: number, y: number, unit: string },
    entities: {
        [key: string]: ISpriteMeta
    }
}

export interface ISpriteMeta {
    pos: {
        x: number,
        y: number
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
