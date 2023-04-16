type PropType = {
  interval?: number
  logMethod?: 'log' | 'table'
}

export default class Statistic {
  startTime: number;
  statObj: Map<string, number>;
  interval: PropType["interval"];
  logMethod: PropType["logMethod"];
  intervalObj;
  constructor({ interval, logMethod }: PropType) {
    this.startTime = Date.now();
    this.statObj = new Map();

    if(interval && logMethod) {
      this.interval = interval;
      this.logMethod = logMethod;
      this.intervalObj = setInterval(() => {
        console[logMethod](Object.fromEntries(this.statObj));
      }, interval)
    }
  }

  set(label: string, count: number) {
    this.statObj.set(label, count);
  }

  add(label: string, count: number) {
    this.statObj.set(label, (this.statObj.get(label) || 0) + count)
  }

  deduct(label: string, count: number) {
    this.statObj.set(label, (this.statObj.get(label) || 0) - count)
  }

  multiply(label: string, count: number) {
    this.statObj.set(label, (this.statObj.get(label) || 1) * count)
  }

  divide(label: string, count: number) {
    const currentCount = this.statObj.get(label);
    if(currentCount === 0) throw "Division by zero";
    this.statObj.set(label, currentCount / count)
  }

  logTable() {
    console.table(Object.fromEntries(this.statObj.entries()))
  }

  log() {
    console.log(Object.fromEntries(this.statObj.entries()))
  }

  stopLogging() {
    clearInterval(this.interval)
  }

}