import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import { RunTimer } from '../components/RunTimer';
import { cyclesCount } from '../components/cyclesCount';
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

  return (
    <>
      <Head>
        <title>Coffee machine cleaning timer</title>
      </Head>
      <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <RunTimer
          ms={prevTime + sessionTime}
          style={{ width: '100vmin', height: '100vmin' }}
        />
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <button
            className="flex flex-col items-center justify-center gap-2 w-56 h-56 active:bg-black/5 rounded-lg uppercase tracking-widest"
            onMouseDown={startStop}
            type="button"
          >
            <div>{cycles}</div>
            <div>{startedAt ? 'Stop' : 'Start'}</div>
          </button>
        </div>

        <div className="fixed right-0 bottom-1 left-0 flex flex-col items-center justify-center">
          <button
            className="py-3 px-5 active:bg-black/5 rounded-lg uppercase tracking-widest text-xs"
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
