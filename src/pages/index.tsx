import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import { RunTimer } from '../components/RunTimer';
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
      setPrevTime((v) => Math.ceil((v + time) / CYCLE_MS) * CYCLE_MS);
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

  return (
    <div>
      <Head>
        <title>Coffee machine cleaning timer</title>
      </Head>

      <button onClick={startStop} type="button">
        {startedAt ? 'Stop' : 'Start'}
      </button>

      <RunTimer ms={prevTime + sessionTime} />
    </div>
  );
};

export default HomePage;
