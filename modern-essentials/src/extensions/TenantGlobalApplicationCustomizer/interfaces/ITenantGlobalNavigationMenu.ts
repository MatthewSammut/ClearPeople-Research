import * as IApplicationBase from '@microsoft/sp-application-base';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

import { IRecentPagesProps } from './IRecentPages';

export interface ITenantGlobalNavigationMenuProps {
  MenuTermSet?: string;
  Context: IApplicationBase.ApplicationCustomizerContext;
  RecentPages: IRecentPagesProps;
  ComponentsRequireUpdate: IGlobalNavigationMenuComponentsRequireUpdateProps;
}

export interface ITenantGlobalNavigationMenuState {
  isLoading: boolean;
  menuItems?: IContextualMenuItem[];
  menuFarItems?: IContextualMenuItem[];
}

export interface IGlobalNavigationMenuComponentsRequireUpdateProps {
  RecentPages?: boolean;
  GlobalMenu?: boolean;
}
