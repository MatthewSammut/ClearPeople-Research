import * as React from "react";
import { ISiteBreadcrumbProps, ISiteBreadcrumbState } from "./../interfaces/ISiteBreadcrumb";
import { IWebInfo } from "./../interfaces/IWebInfo";
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
import { SPHttpClient, HttpClientResponse } from "@microsoft/sp-http";
import styles from './../styles/SiteBreadcrumb.module.scss';

export default class SiteBreadcrumb extends React.Component<ISiteBreadcrumbProps, ISiteBreadcrumbState> {
  private _linkItems: IBreadcrumbItem[];

  constructor(props: ISiteBreadcrumbProps) {
    super(props);

    // Initiate the private link items variable
    this._linkItems = [];

    // Initiate the component state
    this.state = {
      breadcrumbItems: []
    };
  }

  /**
   * React component lifecycle hook, runs after render
   */
  public componentDidMount() {
    // Start generating the links for the breadcrumb
    this._generateLinks();
  }

  /**
   * Start the link generation for the breadcrumb
   */
  private _generateLinks() {

    var currentServerRelativeUrl: string;
    if (this.props.Context.pageContext.list) {
      currentServerRelativeUrl = this.props.Context.pageContext.list.serverRelativeUrl;
    }
    else {
      currentServerRelativeUrl = this.props.Context.pageContext.site.serverRequestPath;
    }

    //console.log(currentServerRelativeUrl);

    // Add the current site to the links list
    this._linkItems.push({
      text: this.props.Context.pageContext.web.title,
      key: this.props.Context.pageContext.web.id.toString(),
      href: this.props.Context.pageContext.web.absoluteUrl,
      //isCurrentItem: !this.props.Context.pageContext.list.serverRelativeUrl //throws error on listviews
      isCurrentItem: !currentServerRelativeUrl
    });

    // Check if the current list URL is available
    if (!!this.props.Context.pageContext.list) {
      // Add the current list to the links list
      this._linkItems.push({
        text: this.props.Context.pageContext.list.title,
        key: this.props.Context.pageContext.list.id.toString(),
        href: currentServerRelativeUrl,
        isCurrentItem: true
      });
    }

    // Check if you are already on the root site
    if (this.props.Context.pageContext.site.serverRelativeUrl === this.props.Context.pageContext.web.serverRelativeUrl) {
      this._setBreadcrumbData();
    } else {
      // Retrieve the parent webs information
      this._getParentWeb(this.props.Context.pageContext.web.absoluteUrl);
    }
  }

  /**
   * Retrieve the parent web URLs
   * @param webUrl Current URL of the web to process
   */
  private _getParentWeb(webUrl: string) {
    // Retrieve the parent web info
    const apiUrl = `${webUrl}/_api/web/parentweb?$select=Id,Title,ServerRelativeUrl`;
    this.props.Context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
      .then((response: HttpClientResponse) => {
        return response.json();
      })
      .then((webInfo: IWebInfo) => {
        if (!webInfo.error) {
          // Check if the correct data is retrieved
          if (!webInfo.ServerRelativeUrl && !webInfo.Title) {
            this._setBreadcrumbData();
            return;
          }

          // Store the current site
          this._linkItems.unshift({
            text: webInfo.Title,
            key: webInfo.Id,
            href: webInfo.ServerRelativeUrl
          });

          // Check if you retrieved all the information up until the root site
          if (webInfo.ServerRelativeUrl === this.props.Context.pageContext.site.serverRelativeUrl) {
            this._setBreadcrumbData();
          } else {
            // retrieve the information from the parent site
            webUrl = webUrl.substring(0, (webUrl.indexOf(`${webInfo.ServerRelativeUrl}/`) + webInfo.ServerRelativeUrl.length));
            this._getParentWeb(webUrl);
          }
        } else {
          // Set the current breadcrumb data which is already retrieved
          this._setBreadcrumbData();
        }
      });
  }

  /**
   * Set the current breadcrumb data
   */
  private _setBreadcrumbData() {
    this.setState({
      breadcrumbItems: this._linkItems
    });
  }

  /**
   * Default React component render method
   */
  public render(): React.ReactElement<ISiteBreadcrumbProps> {

    if (!this.props.Show) {
      return null;
    }

    return (
      <div className={styles.breadcrumb} >
        <div className="ms-bgColor-themePrimary">
          <Breadcrumb
            items={this.state.breadcrumbItems}
            ariaLabel={'Website breadcrumb'}
            className={styles.breadcrumbLinks} />
        </div>
      </div >
    );
  }
}
