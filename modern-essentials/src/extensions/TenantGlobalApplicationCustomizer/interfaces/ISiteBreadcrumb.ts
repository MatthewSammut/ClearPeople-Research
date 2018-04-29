import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import { IBreadcrumbItem } from "office-ui-fabric-react/lib";

export interface ISiteBreadcrumbProps {
  Context?: ApplicationCustomizerContext;
  Show?: boolean;
}

export interface ISiteBreadcrumbState {
  breadcrumbItems: IBreadcrumbItem[];
}
