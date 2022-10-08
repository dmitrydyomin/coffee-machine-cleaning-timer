import { CSSProperties } from 'react';

import { config } from '../config';
import { Arc } from './Arc';

const CYCLE_MS = config.time.work + config.time.rest;

interface RunTimerProps {
  className?: string;
  ms: number;
  style?: CSSProperties;
}

export const RunTimer: React.FC<RunTimerProps> = ({ className, ms, style }) => {
  const runs = Math.floor(ms / CYCLE_MS);
  const current = ms - runs * CYCLE_MS;
  const workMS = Math.min(current, config.time.work);
  return (
    <svg className={className} width={100} height={100} style={style}>
      <Arc color={config.colors.restBlank} length={1} />
      <Arc
        color={config.colors.workBlank}
        length={config.time.work / CYCLE_MS}
      />
      <Arc color={config.colors.rest} length={current / CYCLE_MS} />
      <Arc color={config.colors.work} length={workMS / CYCLE_MS} />
    </svg>
  );
};
