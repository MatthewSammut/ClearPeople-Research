import * as React from 'react';
import * as ReactDom from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp from "sp-pnp-js";

import { ITenantGlobalApplicationCustomizerProps } from './interfaces/ITenantGlobalApplicationCustomizer';
import TenantGlobalFooter from './components/TenantGlobalFooter';
import { ITenantGlobalFooterProps, ITenantGlobalFooterState } from './interfaces/ITenantGlobalFooter';
import TenantGlobalHeader from './components/TenantGlobalHeader';
import { ITenantGlobalHeaderProps, ITenantGlobalHeaderState } from './interfaces/ITenantGlobalHeader';

import { IGlobalNavigationMenuComponentsRequireUpdateProps } from './interfaces/ITenantGlobalNavigationMenu';
import { ITenantGlobalHeaderComponentsRequireUpdate } from './interfaces/ITenantGlobalHeader';

import styles from './styles/AppCustomizer.module.scss';

const LOG_SOURCE: string = 'TenantGlobalApplicationCustomizer';

/** A Custom Action which can be run during execution of a Client Side Application */
export default class TenantGlobalNavBarApplicationCustomizer
  extends BaseApplicationCustomizer<ITenantGlobalApplicationCustomizerProps> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  private _element_TenantGlobalHeader: React.ReactElement<ITenantGlobalHeaderProps>;
  private _element_TenantGlobalFooter: React.ReactElement<ITenantGlobalFooterProps>;
  
  @override
  public async onInit(): Promise<void> {

    //console.log('abc');
    //console.log(`Initialized : ${strings.Title}`);

    // Configure caching
    pnp.setup({
      defaultCachingStore: "local",
      defaultCachingTimeoutSeconds: 900, //15 minutes
      globalCacheDisable: false, // true to disable caching in case of debugging/testing
      spfxContext: this.context
    });

    //Added to handle possible changes on the existence of placeholders
    //this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    //Added to handle possible navigation that doesn't refresh the page fully
    this.context.application.navigatedEvent.add(this, this._renderPlaceHolders);
    
    //console.log(`Top Menu TermSet : ${this.properties.TopMenuTermSet}`);
    //console.log(`Bottom Menu TermSet : ${this.properties.BottomMenuTermSet}`);

    // Call render method for generating the needed html elements
    //this._renderPlaceHolders();

    //this.context.application.navigatedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve<void>();
  }

  private _renderPlaceHolders(): void {

    console.log(`entered _renderPlaceHolders()`);
    
    //console.log(`Available placeholders: ${this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', ')}`);

    // Handling the top placeholder
    if (!this._topPlaceholder) {

      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }
      
      this._element_TenantGlobalHeader = React.createElement(
        TenantGlobalHeader,
        {
          MenuTermSet: this.properties.TopMenuTermSet,
          Context: this.context,
          ShowBreadcrumb: this.properties.ShowBreadcrumb,
          RecentPages: this.properties.RecentPages,
        }
      );

      console.log(`element created and will render: ${this._element_TenantGlobalHeader}`);
      ReactDom.render(this._element_TenantGlobalHeader, this._topPlaceholder.domElement);
    }
    else {

      var GlobalNavigationMenuComponentsRequireUpdate: IGlobalNavigationMenuComponentsRequireUpdateProps = {
        GlobalMenu: false,
        RecentPages: true
      };

      var componentsRequireUpdate: ITenantGlobalHeaderComponentsRequireUpdate = {
        GlobalNavigationMenuComponentsRequireUpdate: GlobalNavigationMenuComponentsRequireUpdate
      };

      this._element_TenantGlobalHeader = React.createElement(
        TenantGlobalHeader,
        {
          MenuTermSet: this.properties.TopMenuTermSet,
          Context: this.context,
          ShowBreadcrumb: this.properties.ShowBreadcrumb,
          RecentPages: this.properties.RecentPages,
          ComponentsRequireUpdate: componentsRequireUpdate
        }
      );

      console.log(`force update here: ${this._element_TenantGlobalHeader}`);
      ReactDom.render(this._element_TenantGlobalHeader, this._topPlaceholder.domElement);
    }
    
    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {

      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error('The expected placeholder (Bottom) was not found.');
        return;
      }

      this._element_TenantGlobalFooter = React.createElement(
        TenantGlobalFooter,
        {
          MenuTermSet: this.properties.BottomMenuTermSet,
          Context: this.context
        }
      );
      ReactDom.render(this._element_TenantGlobalFooter, this._bottomPlaceholder.domElement);
    }
    else {
      ReactDom.render(this._element_TenantGlobalFooter, this._bottomPlaceholder.domElement);
    }

  }

  private _onDispose(): void {
    console.log('[TenantGlobalApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
