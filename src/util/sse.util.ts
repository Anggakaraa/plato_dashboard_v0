import { END, eventChannel } from 'redux-saga';

export function subscribeToSSE(eventSrc: EventSource) {
  return eventChannel((emitter) => {
    eventSrc.onopen = (ev: any) => {
      console.info('connection is established');
      emitter(ev);
    };

    eventSrc.onerror = (err: any) => {
      console.error(err);
    };

    eventSrc.onmessage = (ev: any) => {
        emitter(ev);
    };

    return () => {
      console.info('closing connection...');
      eventSrc.close();
      emitter(END);
    };
  });
}