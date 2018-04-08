export default TimeTraveler;

declare class TimeTraveler {
  constructor(timeLine: Function[], initialState?: any);

  private cache: Map<Function, any>;
  private timeLine: Map<Function, any>;
  private state: any;

  next(): this;
  prev(): this;
  goTo(fn: Function): this;
  getState(): any;
}
