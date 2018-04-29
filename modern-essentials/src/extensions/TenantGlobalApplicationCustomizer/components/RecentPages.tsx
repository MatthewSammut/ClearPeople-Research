import * as React from "react";
import { IWebInfo } from "./../interfaces/IWebInfo";
import pnp from "sp-pnp-js";

import { IRecentPagesProps, IRecentPagesState } from "./../interfaces/IRecentPages";

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

import recentPagesHelper from './../helpers/RecentPagesHelper';
import graphClientHelper from './../../../common/helpers/MSGraphClientHelper';

export default class RecentPages extends React.Component<IRecentPagesProps, IRecentPagesState> {

  //private _pageItems: IContextualMenuItem[];

  constructor() {
    super();

    // Initiate the component state
    this.state = {
      isLoading: true,
      pageItems: []
    };

  }

  private update() {
    console.log(`update called`);
  }

  public componentDidMount() {
    this.setState({ isLoading: true });

    console.log(`Tenant Global Nav Bar : componentWillMount`);

    var size: number = this.props.Size ? this.props.Size : 5; //default to 5 if size is null; 

    recentPagesHelper.getRecentPagesMenu(size, this.props.Context).then(data => {

      graphClientHelper.getSomeStuffUsingGraph(this.props.Context);

      this.setState({
        isLoading: false,
        pageItems: data
      });
    });

    

  }

  public componentWillUpdate() {
    console.log(`component will update called`);
  }

  public render(): React.ReactElement<IRecentPagesProps> {

    if (!this.props.Show) {
      return null;
    }

    if (this.state.isLoading) {
      return (
        <div className={`loading`}>
          Loading
        </div>
      );
    }

    return (
      <div>
        <div className="ms-bgColor-themePrimary">
          <CommandBar
            className='asd'
            isSearchBoxVisible={false}
            elipisisAriaLabel='More options'
            items={this.state.pageItems}
          />
        </div>
      </div >
    );
  }
}
