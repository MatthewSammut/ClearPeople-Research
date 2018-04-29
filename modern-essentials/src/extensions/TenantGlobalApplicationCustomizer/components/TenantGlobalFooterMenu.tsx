import * as React from 'react';
import styles from '../styles/AppCustomizer.module.scss';

import pnp from "sp-pnp-js";

import { ITenantGlobalFooterMenuProps, ITenantGlobalFooterMenuState } from './../interfaces/ITenantGlobalFooterMenu';
import * as ISPTermStore from "./../../../common/interfaces/ISPTermStore";
import { SPTermStoreService } from "./../../../common/services/SPTermStoreService";

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import recentPagesHelper from './../helpers/RecentPagesHelper';
import * as globalConstants from './../helpers/GlobalConstants';

export default class TenantGlobalFooterMenu extends React.Component<ITenantGlobalFooterMenuProps, ITenantGlobalFooterMenuState> {

  /**
  * Main constructor for the component
  */
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  public componentDidMount() {
   
    //console.log(`Tenant Global Footer Bar : componentWillMount`);

    this.fetchMenuItems().then(data => {
      this.setState({
        isLoading: false,
        menuItems: data
      });
    });

  }

  private async fetchMenuItems(): Promise<ISPTermStore.ISPTermObject[]> {

    //console.log(`fetch menu items - top menu termset: ${this.props.TopMenuTermSet}`);
    //console.log(`fetch menu items - absoluteUrl: ${this.props.Context.pageContext.web.absoluteUrl}`);

    let termStoreService: SPTermStoreService = new SPTermStoreService({
      spHttpClient: this.props.Context.spHttpClient,
      siteAbsoluteUrl: this.props.Context.pageContext.web.absoluteUrl,
    });

    if (this.props.MenuTermSet != null) {
      let cachedTerms = pnp.storage.local.get(globalConstants.GLOBAL_FOOTER__MENU_TERMSET_KEY);
      if (cachedTerms != null) {
        return cachedTerms;
      }
      else {
        var data = await termStoreService.getTermsFromTermSetAsync(this.props.MenuTermSet, this.props.Context.pageContext.web.language);
        pnp.storage.local.put(globalConstants.GLOBAL_FOOTER__MENU_TERMSET_KEY, data);
        return data;
      }
    }
    else {
      console.log("Warning: TermSet not set");
    }

  }

  private projectMenuItem(menuItem: ISPTermStore.ISPTermObject, itemType: ContextualMenuItemType): IContextualMenuItem {
    return ({
      key: menuItem.identity,
      name: menuItem.name,
      itemType: itemType,
      href: menuItem.terms.length == 0 ?
        (menuItem.localCustomProperties["_Sys_Nav_SimpleLinkUrl"] != undefined ?
          menuItem.localCustomProperties["_Sys_Nav_SimpleLinkUrl"]
          : null)
        : null,
      subMenuProps: menuItem.terms.length > 0 ?
        { items: menuItem.terms.map((i) => { return (this.projectMenuItem(i, ContextualMenuItemType.Normal)); }) }
        : null,
      isSubMenu: itemType != ContextualMenuItemType.Header,
    });
  }

  public render(): React.ReactElement<ITenantGlobalFooterMenuProps> {

    if (this.state.isLoading) {
      return (
        <div className={`loading`}>
          Loading
        </div>
      );
    }

    var commandBarItems: IContextualMenuItem[] = this.state.menuItems.map((i) => {
      return (this.projectMenuItem(i, ContextualMenuItemType.Header));
    });
    
    return (
      <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.app}`}>
        <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.top}`}>
          <CommandBar
            className={styles.commandBar}
            isSearchBoxVisible={false}
            elipisisAriaLabel='More options'
            items={commandBarItems}
          />
        </div>
      </div>
    );
  }
}
