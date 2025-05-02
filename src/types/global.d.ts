declare global {
  var ipTracker: {
    [key: string]: {
      count: number;
      firstRequest: number;
      lastRequest: number;
      blocked: boolean;
      blockUntil: number;
    };
  };
}
