import { config } from '../config';

interface ArcProps {
  color: string;
  length: number;
}

const FULL_ARC = config.svg.radius * 2 * Math.PI;

export const Arc: React.FC<ArcProps> = ({ color, length }) => (
  <circle
    cx={`${config.svg.offset}%`}
    cy={`${config.svg.offset}%`}
    r={`${config.svg.radius}%`}
    stroke={color}
    fill="transparent"
    strokeWidth={`${config.svg.lineWidth}%`}
    strokeDashoffset={`${FULL_ARC / 4}%`}
    strokeDasharray={`${FULL_ARC * length}% ${(1 - length) * FULL_ARC}%`}
  />
);
