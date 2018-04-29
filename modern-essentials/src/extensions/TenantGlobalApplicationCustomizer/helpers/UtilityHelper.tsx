import * as React from "react";

export class utilityHelper {

  constructor() {
  }

  public Sleep(ms: number = 0) {
    return new Promise(r => setTimeout(r, ms));
  }

  public addDaysToNow(days: number): Date {
    let dtNow : Date = new Date();
    dtNow.setDate(dtNow.getDate() + days);
    return dtNow;
  }

}
export default new utilityHelper();
