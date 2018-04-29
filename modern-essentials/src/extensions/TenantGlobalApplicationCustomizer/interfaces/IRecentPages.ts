import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import { IContextualMenuItem } from "office-ui-fabric-react/lib";

export interface IPage {
  name: string;
  title?: string;
  key: string;
  href?: string;
  children?: IPage[];
}

export interface IRecentPagesProps {
  Context?: ApplicationCustomizerContext;
  AddToFarRight?:  boolean;
  Show?: boolean;
  Size?: number;
}

export interface IRecentPagesState {
  isLoading: boolean;
  pageItems: IContextualMenuItem[];
}
