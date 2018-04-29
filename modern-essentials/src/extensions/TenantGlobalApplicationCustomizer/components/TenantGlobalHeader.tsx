import * as React from 'react';

import styles from '../styles/AppCustomizer.module.scss';
import pnp from "sp-pnp-js";

import { ITenantGlobalHeaderProps, ITenantGlobalHeaderState, ITenantGlobalHeaderComponentsRequireUpdate } from './../interfaces/ITenantGlobalHeader';

import SiteBreadcrumb from './SiteBreadcrumb';
import TenantGlobalNavigationMenu from './TenantGlobalNavigationMenu';
import RecentPages from './RecentPages';

export default class TenantGlobalHeader extends React.Component<ITenantGlobalHeaderProps, ITenantGlobalHeaderState> {

  /**
  * Main constructor for the component
  */
  constructor() {
    super();
    this.state = {

    };

    console.log(`TenantGlobalHeader: constructor`);
  }

  public componentDidMount() {
    console.log(`TenantGlobalHeader: componentWillMount`);

  }

  public componentWillReceiveProps() {
    console.log(`TenantGlobalHeader: componentWillReceiveProps`);
  }

  public render(): React.ReactElement<ITenantGlobalHeaderProps> {

    console.log(`TenantGlobalHeader: render()`);

    let breadcrumb = () => {
      if (!this.props.ShowBreadcrumb) return;
      return (
        <div className='site-breadcrumb'>
          <SiteBreadcrumb Context={this.props.Context} />
        </div>
      );
    };

    if (this.props.ComponentsRequireUpdate) {
      var globalNavigationMenuComponentsRequireUpdate = this.props.ComponentsRequireUpdate.GlobalNavigationMenuComponentsRequireUpdate;
    }
    
    //return (
    //  <div>
    //    <div className='recent-pages'>
    //      <RecentPages Context={this.props.Context} />
    //    </div>
    //    <div className='global-navigation'>
    //      <TenantGlobalNavigationMenu Context={this.props.Context} MenuTermSet={this.props.MenuTermSet} />
    //    </div>
    //    {breadcrumb()}
    //  </div>
    //);

    return (
      <div>
        <div className='global-navigation'>
          <TenantGlobalNavigationMenu Context={this.props.Context} MenuTermSet={this.props.MenuTermSet} RecentPages={this.props.RecentPages} ComponentsRequireUpdate={globalNavigationMenuComponentsRequireUpdate} />
        </div>
        {breadcrumb()}
      </div>
    );
  }
}
