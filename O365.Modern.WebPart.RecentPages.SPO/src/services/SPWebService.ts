import pnp from "sp-pnp-js";

export class SPWebService {
  
  constructor() {
  }

  public async getCurrentWebTitle(): Promise<string> {

    let promise: Promise<string> = new Promise<string>((resolve) => {

      pnp.sp.web.select("Title").get().then(w => {
        resolve(w.Title);
      });

    });
    return promise;
  }

}
export default new SPWebService();

