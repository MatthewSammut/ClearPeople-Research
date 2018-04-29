import * as ISPTermStore from './../../../common/interfaces/ISPTermStore'; 
import * as IApplicationBase from '@microsoft/sp-application-base';

export interface ITenantGlobalFooterMenuProps {
  MenuTermSet?: string;
  Context: IApplicationBase.ApplicationCustomizerContext;
}

export interface ITenantGlobalFooterMenuState {
  isLoading: Boolean;
  menuItems?: ISPTermStore.ISPTermObject[];
}
