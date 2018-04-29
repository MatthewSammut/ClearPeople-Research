import { MSGraphClient } from '@microsoft/sp-client-preview';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';

export class MSGraphClientHelper {

  constructor() {
  }

  public getSomeStuffUsingGraph(context: any) {

    console.log('get get get');

    console.log(MSGraphClient.serviceKey);
    console.log(context.serviceScope);
    
    const client: MSGraphClient = context.serviceScope.consume(MSGraphClient.serviceKey);

    console.log(client);

    client.api('/me')
      .get((error, response: any, rawResponse?: any) => {
        // handle the response
        console.log('graph response');
        console.log(response);
        console.log(error);
      });
    
   
      client
      .api("users")
      .version("v1.0")
      .select("displayName,mail,userPrincipalName")
      .get((err, res) => {  

        console.log('graph response');
        console.log(res);
        
        if (err) {
          console.error(err);
          return;
        }

      });

  }

}
export default new MSGraphClientHelper();