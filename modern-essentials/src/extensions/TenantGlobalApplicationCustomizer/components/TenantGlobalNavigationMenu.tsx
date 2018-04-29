import * as React from 'react';

import styles from '../styles/AppCustomizer.module.scss';
import pnp from "sp-pnp-js";

import * as ISPTermStore from "./../../../common/interfaces/ISPTermStore";
import { SPTermStoreService } from "./../../../common/services/SPTermStoreService";
import { ITenantGlobalNavigationMenuProps, ITenantGlobalNavigationMenuState } from './../interfaces/ITenantGlobalNavigationMenu';

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

import recentPagesHelper from './../helpers/RecentPagesHelper';
import utilityHelper from './../helpers/UtilityHelper';
import * as globalConstants from './../../../common/helpers/GlobalConstants';

import Loading from 'react-loading-spinner';
import { BeatLoader } from 'react-spinners';

import graphClientHelper from './../../../common/helpers/MSGraphClientHelper';

export default class TenantGlobalNavigationMenu extends React.Component<ITenantGlobalNavigationMenuProps, ITenantGlobalNavigationMenuState> {

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
    this.loadData();
  }

  public componentWillReceiveProps(nextProps: ITenantGlobalNavigationMenuProps) {
    console.log(`TenantGlobalNavigationMenu: componentWillReceiveProps`);
    this.updateData(nextProps.ComponentsRequireUpdate.RecentPages, nextProps.ComponentsRequireUpdate.GlobalMenu);
  }

  private async loadData() {

    var recentPagesSize: number = this.props.RecentPages.Size ? this.props.RecentPages.Size : 5; //default to 5 if size is null;

    if ((!this.props.RecentPages || !this.props.RecentPages.Show)) { //if recent pages is not configured or not show
      this.loadTopNavigationMenuItems();
    }
    else { //if recent pages is configured and will show
      if (this.props.RecentPages.AddToFarRight) {
        this.loadTopNavigationMenuItems();
        this.loadRecentPagesMenuItems(recentPagesSize);
      }
      else {
        this.loadTopNavigationMenuItemsAndAppendRecentPagesMenuItem(recentPagesSize);
      }
    }
  }
  private async updateData(bRecentPagesRequireUpdate: boolean, bNavigationMenuRequireUpdate: boolean) {

    var recentPagesSize: number = this.props.RecentPages.Size ? this.props.RecentPages.Size : 5; //default to 5 if size is null;

    if ((!this.props.RecentPages || !this.props.RecentPages.Show)) { //if recent pages is not configured or not show
      if (bNavigationMenuRequireUpdate) this.loadTopNavigationMenuItems();
    }
    else { //if recent pages is configured and will show
      if (this.props.RecentPages.AddToFarRight) {
        if (bNavigationMenuRequireUpdate) this.loadTopNavigationMenuItems();
        if (bRecentPagesRequireUpdate) this.loadRecentPagesMenuItems(recentPagesSize);
      }
      else {
        if (bRecentPagesRequireUpdate || bNavigationMenuRequireUpdate) this.loadTopNavigationMenuItemsAndAppendRecentPagesMenuItem(recentPagesSize);
      }
    }
  }

  private async loadTopNavigationMenuItems() {

     this.fetchMenuItems().then(menuItems => {

        var commandBarItems: IContextualMenuItem[] = menuItems.map((i) => {
          return (this.projectMenuItems(i, ContextualMenuItemType.Header));
        });

        this.setState({
          isLoading: false,
          menuItems: commandBarItems,
        });

      });
  }

  private async loadRecentPagesMenuItems(recentPagesSize: number) {

    graphClientHelper.getSomeStuffUsingGraph(this.props.Context);

    recentPagesHelper.getRecentPagesMenu(recentPagesSize, this.props.Context).then(recentPagesMenu => {
      this.setState({
        isLoading: false,
        menuFarItems: recentPagesMenu
      });
    });

  }

  private async loadTopNavigationMenuItemsAndAppendRecentPagesMenuItem(recentPagesSize: number) {
    this.fetchMenuItems().then(menuItems => {

      var commandBarItems: IContextualMenuItem[] = menuItems.map((i) => {
        return (this.projectMenuItems(i, ContextualMenuItemType.Header));
      });

      recentPagesHelper.getRecentPagesMenu(recentPagesSize, this.props.Context).then(recentPagesMenu => {
        commandBarItems.push(recentPagesMenu[0]);
        this.setState({
          isLoading: false,
          menuItems: commandBarItems,
        });
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
      let cachedTerms = pnp.storage.local.get(globalConstants.GLOBAL_HEADER_MENU_TERMSET_KEY);
      if (cachedTerms != null) {
        return cachedTerms;
      }
      else {
        var data = await termStoreService.getTermsFromTermSetAsync(this.props.MenuTermSet, this.props.Context.pageContext.web.language);
        pnp.storage.local.put(globalConstants.GLOBAL_HEADER_MENU_TERMSET_KEY, data);
        return data;
      }
    }
    else {
      console.log("Warning: TermSet not set");
    }

  }

  private projectMenuItems(menuItem: ISPTermStore.ISPTermObject, itemType: ContextualMenuItemType): IContextualMenuItem {
    return ({
      key: menuItem.identity,
      name: menuItem.name,
      itemType: itemType,
      iconProps: { iconName: (menuItem.localCustomProperties.iconName != undefined ? menuItem.localCustomProperties.iconName : null) },
      href: menuItem.terms.length == 0 ?
        (menuItem.localCustomProperties["_Sys_Nav_SimpleLinkUrl"] != undefined ?
          menuItem.localCustomProperties["_Sys_Nav_SimpleLinkUrl"]
          : null)
        : null,
      subMenuProps: menuItem.terms.length > 0 ?
        { items: menuItem.terms.map((i) => { return (this.projectMenuItems(i, ContextualMenuItemType.Normal)); }) }
        : null,
      isSubMenu: itemType != ContextualMenuItemType.Header,
    });
  }

  public render(): React.ReactElement<ITenantGlobalNavigationMenuProps> {

    console.log(`TenantGlobalNavigationMenu: render`);

    if (this.state.isLoading) {
      return (<BeatLoader loading={this.state.isLoading} margin={"15px 0px 0px 10px"} />);
    }

    return (
      <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.app}`} >
        <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.top}`} >
          <CommandBar
            className={styles.commandBar}
            isSearchBoxVisible={false}
            items={this.state.menuItems}
            farItems={this.state.menuFarItems}
            />
        </div>
      </div >
    );


  }
}
