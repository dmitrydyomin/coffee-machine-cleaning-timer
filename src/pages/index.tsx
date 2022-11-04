import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import { RunTimer } from '../components/RunTimer';
import { cyclesCount } from '../components/cyclesCount';
import {
  useCyclesStorage,
  useLastCleans,
} from '../components/useCyclesStorage';
import { config } from '../config';

const UPDATE_INTERVAL_MS = config.time.refreshInterval;
const CYCLE_MS = config.time.work + config.time.rest;

const HomePage: NextPage = () => {
  const [prevTime, setPrevTime] = useState(0);
  const [startedAt, setStartedAt] = useState<number | undefined>();
  const [sessionTime, setSessionTime] = useState(0);

  const startStop = useCallback(() => {
    if (startedAt !== undefined) {
      setStartedAt(undefined);
      const time = Date.now() - startedAt;
      const cycles = cyclesCount(time);
      setPrevTime((v) => v + cycles * CYCLE_MS);
      setSessionTime(0);
    } else {
      setStartedAt(Date.now());
    }
  }, [startedAt]);

  useEffect(() => {
    if (!startedAt) {
      return;
    }
    const handler = () => {
      setSessionTime(Date.now() - startedAt);
    };
    const i = setInterval(handler, UPDATE_INTERVAL_MS);
    return () => {
      clearInterval(i);
    };
  }, [prevTime, startedAt]);

  const reset = useCallback(() => {
    setStartedAt(undefined);
    setPrevTime(0);
    setSessionTime(0);
  }, []);

  const cycles = cyclesCount(prevTime + sessionTime);

  useCyclesStorage(cycles);
  const lastCleans = useLastCleans();

  return (
    <>
      <Head>
        <title>Coffee machine cleaning timer</title>
      </Head>
      <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <div className="absolute left-2 top-2 text-xs opacity-40">
          {lastCleans.map((c) => (
            <div key={c.date}>
              {c.date}: {c.value}
            </div>
          ))}
        </div>

        <RunTimer
          ms={prevTime + sessionTime}
          style={{ width: '100vmin', height: '100vmin' }}
        />
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <button
            className="h-56 w-56 flexflex-col items-center justify-center gap-2 rounded-full uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-black/5"
            onClick={startStop}
            type="button"
          >
            <div className="text-xl">{cycles}</div>
            <div className="text-xs text-gray-600">
              {startedAt ? 'Stop' : 'Start'}
            </div>
          </button>
        </div>

        <div className="fixed right-0 bottom-1 left-0 flex flex-col items-center justify-center">
          <button
            className="rounded-lg py-3 px-5 text-xs uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-black/5"
            onClick={reset}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
