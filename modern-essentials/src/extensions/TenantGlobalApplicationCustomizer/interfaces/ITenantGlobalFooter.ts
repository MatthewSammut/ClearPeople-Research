import * as ISPTermStore from './../../../common/interfaces/ISPTermStore'; 
import * as IApplicationBase from '@microsoft/sp-application-base';

export interface ITenantGlobalFooterProps {
  MenuTermSet?: string;
  Context: IApplicationBase.ApplicationCustomizerContext;
}

export interface ITenantGlobalFooterState {
}
