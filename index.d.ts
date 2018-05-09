export default TimeTraveler;

declare class TimeTraveler {
  constructor(timeLine: Function[], initialState?: any);

  private cache: Map<Function, any>;
  private timeLine: Map<Function, any>;
  private state: any;

  static create(timeLine: Function[], initialState?: any);
  private setState(): this;
  add(fn: Function): this;
  getState(): any;
  goTo(fn: Function): this;
  next(): this;
  prev(): this;
  reset(): this;
}
