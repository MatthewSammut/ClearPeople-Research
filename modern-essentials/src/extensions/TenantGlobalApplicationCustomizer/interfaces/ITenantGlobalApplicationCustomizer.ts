import { IRecentPagesProps } from './IRecentPages';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITenantGlobalApplicationCustomizerProps {
  TopMenuTermSet?: string;
  BottomMenuTermSet?: string;
  ShowBreadcrumb?: boolean;
  RecentPages?: IRecentPagesProps;
}
