import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { IContextualMenuItem } from "office-ui-fabric-react/lib";

export interface IPage {
  name: string;
  title?: string;
  key: string;
  href?: string;
  children?: IPage[];
}

export interface IRecentPagesProps {
  context?: IWebPartContext;
  description: string;
  addToFarRight?: boolean;
  show?: boolean;
  size?: number;
  layout?: any;
}

export interface IRecentPagesState {
  isLoading: boolean;
  pageItems: IContextualMenuItem[];
}
