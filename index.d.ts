export default TimeTraveler;

declare class TimeTraveler {
  constructor(timeLine: Function[], initialState?: any);

  private cache: Map<Function, any>;
  private timeLine: Map<Function, any>;
  private state: any;

  private setState(): this;
  add(): this;
  getState(): any;
  goTo(fn: Function): this;
  next(): this;
  prev(): this;
  reset(): this;
}
