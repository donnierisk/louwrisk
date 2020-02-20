export const spriteConfig: ISpriteConfig = {
    sheetSize: { x: 1792, y: 1280 },
    blockSize: {
        x: 256, y: 256, unit: 'px'
    },
    entities: {
        player: {
            pos: { x: 0, y: 0 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 },
            animations: {
                walkDown: [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 0, y: 2 }],
                walkLeft: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                walkRight: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                walkUp: [{ x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }]
            }
        },
        crate1: {
            pos: { x: -1, y: 0 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 },
            animations: {}
        },
        bandit: {
            pos: { x: -1, y: -1 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 },
            animations: {}
        },
        rock: {
            pos: { x: -1, y: -2 },
            gridSpan: { x: 1, y: 1 },
            sourceBlock: { x: 0, y: 0 },
            animations: {}
        },
        tree: {
            pos: { x: -2, y: 0 },
            gridSpan: { x: 3, y: 3 },
            sourceBlock: { x: 1, y: 2 },
            animations: {}
        },
        wagon: {
            pos: { x: 0, y: -3 },
            gridSpan: { x: 2, y: 2 },
            sourceBlock: { x: 0, y: 1 },
            animations: {}
        }
    }
}

export interface ISpriteConfig {
    sheetSize: { x: number, y: number },
    blockSize: { x: number, y: number, unit: string },
    entities: {
        [key: string]: ISpriteMeta,
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
    },
    animations: {
        [key: string]: Array<{ x: number, y: number }>
    }
}
