export const enum Const {
    NetFq = 60,
    InputDelay = 8,

    // ~35 bytes
    Prediction = 0,

    // ~130 bytes
    RLE = 0,

    StartWeapon = 0,

    NetPrecision = 65536,
}

export let _debugLagK = 2;

export const setDebugLagK = (a: number) => _debugLagK = a;
