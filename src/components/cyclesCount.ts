import { config } from '../config';

const CYCLE_MS = config.time.work + config.time.rest;

export const cyclesCount = (ms: number) => {
  const fullCycles = Math.floor(ms / CYCLE_MS);
  const left = ms - fullCycles * CYCLE_MS;
  const oneMoreCycle =
    left > config.time.work * config.time.cycleCompleteThreshold;
  return fullCycles + (oneMoreCycle ? 1 : 0);
};
