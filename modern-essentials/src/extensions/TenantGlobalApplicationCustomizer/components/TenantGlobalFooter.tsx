import * as React from 'react';
import styles from '../styles/AppCustomizer.module.scss';

import pnp from "sp-pnp-js";

import { ITenantGlobalFooterProps, ITenantGlobalFooterState } from './../interfaces/ITenantGlobalFooter';
import TenantGlobalFooterMenu from './TenantGlobalFooterMenu';

export default class TenantGlobalFooter extends React.Component<ITenantGlobalFooterProps, ITenantGlobalFooterState> {

  /**
  * Main constructor for the component
  */
  constructor() {
    super();
    this.state = {
    };
  }

  public componentDidMount() {
   
  }

  public render(): React.ReactElement<ITenantGlobalFooterProps> {

    return (
      <TenantGlobalFooterMenu Context={this.props.Context} MenuTermSet={this.props.MenuTermSet} />
    );
  }
}
        
