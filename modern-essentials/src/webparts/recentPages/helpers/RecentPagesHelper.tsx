import * as React from "react";

//import { IWebInfo } from "./../interfaces/IWebInfo";
import pnp from "sp-pnp-js";

import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import SPWebService from './../../../common/services/SPWebService';

import * as globalConstants from './../../../common/helpers/GlobalConstants';
import utilityHelper from './../../../common/helpers/UtilityHelper';
import { IPage } from './../interfaces/IRecentPages';

import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import { IWebPartContext } from '@microsoft/sp-webpart-base';

export class RecentPagesHelper {

  constructor() {
  }
  
  /*Gets recent pages from local storage and updates storage with current page by adding it,
  or if it exists already, by shifting it to the beginning of the list*/
  private async fetchRecentPageItems(size: number, context: IWebPartContext): Promise<IPage[]> {

    console.log(context);

    // Configure caching
    pnp.setup({
     spfxContext: context
    });

    let promise: Promise<IPage[]> = new Promise<IPage[]>((resolve, reject) => {

      let recentPagesItems = pnp.storage.local.get(globalConstants.GLOBAL_RECENT_PAGES_KEY);
      if (recentPagesItems == null) {
        recentPagesItems = [];
      }

      var pageContext = context.pageContext;
      var currentServerRelativeUrl;

      if (pageContext.list && pageContext.listItem) { //check if it's a list or document library
        currentServerRelativeUrl = context.pageContext.site.serverRequestPath;
      }
      else if (pageContext.list && !pageContext.listItem) { //check if it's an item or a page
        currentServerRelativeUrl = context.pageContext.list.serverRelativeUrl;
      }
      else if (!pageContext.list && !pageContext.listItem) { //then must be a layouts page
        currentServerRelativeUrl = window.location.href; //not sure if there's a way to get this - let's try using window location
      }
      else{
        console.log(`Warning: we have a case not yet handled`);
      }

      console.log(`Recent Page - url: ${currentServerRelativeUrl} and title: ${document.title}`);
      console.log(context);

      SPWebService.getCurrentWebTitle().then(title => {

        var name = document.title;

        //console.log(`Title: ${title} and Name: ${document.title}`);
        //console.log(name.indexOf(title));
       
        if (name.indexOf(title) == -1) {
          name = `${title} - ${name}`;
        }

        var currentPageItem: IPage = {
          name: name,
          title: name,
          href: currentServerRelativeUrl,
          key: currentServerRelativeUrl
        };

        //console.log(currentPageItem);

        var pageFromHistoryIndex = recentPagesItems.findIndex(i => i.key === currentPageItem.key);
        if (pageFromHistoryIndex != -1) {
          recentPagesItems.splice(pageFromHistoryIndex, 1); //remove the current page from the 'middle' of the array if it exists
          recentPagesItems.unshift(currentPageItem); //add current page to the top of the array
        }
        else {
          recentPagesItems.unshift(currentPageItem); //add current page to the top of the array
        }

        if (recentPagesItems.length > size) {
          recentPagesItems.pop(); //remove last page if exceeds limit
        }

        pnp.storage.local.put(globalConstants.GLOBAL_RECENT_PAGES_KEY, recentPagesItems, utilityHelper.addDaysToNow(10));

        resolve(recentPagesItems);

      });
    });
    return promise;
  }

  /*Projects iPages to contextual menu with a recursive method to bild the menu structure*/
  private projectMenuItems(menuItem: IPage, itemType: ContextualMenuItemType): IContextualMenuItem {
    return ({
      key: menuItem.key,
      name: menuItem.name,
      itemType: itemType,
      href: menuItem.href,
      subMenuProps: (menuItem.children && menuItem.children.length > 0) ?
        { items: menuItem.children.map((i) => { return (this.projectMenuItems(i, ContextualMenuItemType.Normal)); }) }
        : null,
      isSubMenu: itemType != ContextualMenuItemType.Header,
    });
  }

  public getRecentPagesMenu(size: number, context: IWebPartContext): Promise<IContextualMenuItem[]> {

    let promise: Promise<IContextualMenuItem[]> = new Promise<IContextualMenuItem[]>((resolve, reject) => {

      var recentPageMenuItems: IContextualMenuItem[];
      this.fetchRecentPageItems(size, context).then(recentPages => {

        if (recentPages && recentPages.length > 0) {

          var recentPagesHeading = [];

          var recentPagesMenu: IPage = {
            name: 'Recent Pages',
            title: 'Recent Pages',
            key: 'Recent Pages',
            children: recentPages
          };

          recentPagesHeading.push(recentPagesMenu);

          recentPageMenuItems = recentPagesHeading.map((i) => {
            return (this.projectMenuItems(i, ContextualMenuItemType.Header));
          });
        }

        resolve(recentPageMenuItems);

      }).catch(error => {
        reject(error);
      });
    });

    return promise;
  }

}
export default new RecentPagesHelper();
