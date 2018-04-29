import * as ISPTermStore from './../../../common/interfaces/ISPTermStore'; 
import * as IApplicationBase from '@microsoft/sp-application-base';

import { IRecentPagesProps } from './IRecentPages';
import { IGlobalNavigationMenuComponentsRequireUpdateProps } from './ITenantGlobalNavigationMenu';


export interface ITenantGlobalHeaderProps {
  MenuTermSet?: string;
  Context: IApplicationBase.ApplicationCustomizerContext;
  ShowBreadcrumb: boolean;
  RecentPages: IRecentPagesProps;
  ComponentsRequireUpdate?: ITenantGlobalHeaderComponentsRequireUpdate;
}

export interface ITenantGlobalHeaderState {
  
}

export interface ITenantGlobalHeaderComponentsRequireUpdate {
  GlobalNavigationMenuComponentsRequireUpdate?: IGlobalNavigationMenuComponentsRequireUpdateProps;
}
