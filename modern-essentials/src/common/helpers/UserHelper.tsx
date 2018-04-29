import { MSGraphClient } from '@microsoft/sp-client-preview';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';


import { GLOBAL_RECENT_PAGES_KEY } from '../../extensions/TenantGlobalApplicationCustomizer/helpers/GlobalConstants';
import { IUserExtendedProperty } from '../interfaces/IUser';

export class UserHelper {

  constructor() {
  }

  public GetCurrentUserExtendedProperties(context: any): Promise<IUserExtendedProperty[]> {
    let promise: Promise<IUserExtendedProperty[]> = new Promise<IUserExtendedProperty[]>((resolve, reject) => {
      const client: MSGraphClient = context.serviceScope.consume(MSGraphClient.serviceKey);

      client.api('/me')
        .expand("extensions")
        .select("id,displayName")
        .get((error, response: any, rawResponse?: any) => {

          // handle the response
          if (response) {
            console.log('Current Users Extended Properties - response');

            //response.extensions => map ()
            resolve(response.extensions)


          }

          if (error) {
            reject(error);
          }

        });

    });
    return promise;
  }

  public GetCurrentUserExtendedProperty(context: any, extendedPropertyName: string): Promise<IUserExtendedProperty> {
    let promise: Promise<IUserExtendedProperty> = new Promise<IUserExtendedProperty>((resolve, reject) => {

      this.GetCurrentUserExtendedProperties(context).then(response => {

        response = response.filter(function (item, index, array) {
          return item.extensionName == extendedPropertyName
        });

        if (response.length === 1) {
          let responseObject = response[0] as IUserExtendedProperty;
          console.log(responseObject);
          resolve(responseObject);
        }
        else {
          resolve(null);
        }

      })
    });
    return promise;
  }

  public UpdateCurrentUserExtendedProperty(context: any, extendedPropertyName: string, content: string): void {
    const client: MSGraphClient = context.serviceScope.consume(MSGraphClient.serviceKey);

    this.GetCurrentUserExtendedProperty(context, extendedPropertyName).then(response => {

      console.log(response);

      if (response) {

        console.log(`Updating ${extendedPropertyName} with new Content: ${content}`)

        const extension: IUserExtendedProperty = {
          extensionName: `${extendedPropertyName}`,
          id: `${extendedPropertyName}`,
          content: `${content}`
        };

        client.api(`me/extensions/${extendedPropertyName}`)
          .header("Content-type", "application/json")
          .patch(extension)
          .catch((error) => {
            console.log(`error`);
            console.log(error);
          }).then((response) => {

            if (response) {
              console.log(`response`);
              console.log(response);
            }

          });

      }
      else {
        this.AddCurrentUserExtendedProperty(context, extendedPropertyName, content);
      }

    });
  }

  public AddCurrentUserExtendedProperty(context: any, extendedPropertyName: string, content: string): void {
    const client: MSGraphClient = context.serviceScope.consume(MSGraphClient.serviceKey);

    const extension: IUserExtendedProperty = {
      extensionName: `${extendedPropertyName}`,
      id: `${extendedPropertyName}`,
      content: `${content}`
    };

    console.log(extension);

    client.api('me/extensions')
      .header("Content-type", "application/json")
      .post(extension)
      .catch((error) => {
        console.log(`error`);
        console.log(error);
      }).then((response) => {

        if (response) {
          console.log(`response`);
          console.log(response);
        }

      });

  }

  public DeleteCurrentUserExtendedProperty(context: any, extendedPropertyName: string): void {

    const client: MSGraphClient = context.serviceScope.consume(MSGraphClient.serviceKey);

    client.api(`me/extensions/${extendedPropertyName}`)
      .delete()
      .catch((error) => {
        console.log(`error`);
        console.log(error);
      }).then((response) => {

        if (response) {
          console.log(`response`);
          console.log(response);
        }

      });

  }

}
export default new UserHelper();