import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { config } from '../config';

type DayRec = {
  date: string;
  value: number;
};

const readStorage = (): DayRec[] => {
  try {
    const data = window.localStorage.getItem(config.storage.localStorageKey);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeStorage = (data: DayRec[]) => {
  window.localStorage.setItem(
    config.storage.localStorageKey,
    JSON.stringify(data)
  );
};

const saveDelta = (v: number, date: Date) => {
  const data = readStorage();
  const d = dayjs(date).format('YYYY-MM-DD');
  const existing = data.findIndex((v) => v.date === d);
  if (existing !== -1) {
    data[existing].value += v;
  } else {
    data.push({ date: d, value: v });
  }
  writeStorage(data);
};

export const useCyclesStorage = (current: number) => {
  const prev = useRef(current);
  useEffect(() => {
    const delta = Math.max(current - prev.current, 0);
    if (delta !== 0) {
      saveDelta(delta, new Date());
    }
    prev.current = current;
  }, [current]);
};

export const useLastCleans = () => {
  const [cleans] = useState<DayRec[]>(() => {
    const data = readStorage();
    const recent = data.filter(
      (v) => v.value >= config.storage.cyclesThreshold
    );
    recent.sort((a, b) => b.date.localeCompare(a.date));
    return recent.slice(0, config.storage.recentDates);
  });

  return cleans;
};
