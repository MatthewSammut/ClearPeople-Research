import * as React from 'react';
import styles from './../styles/RecentPages.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import recentPagesHelper from './../helpers/RecentPagesHelper';
import { IRecentPagesProps, IRecentPagesState } from './../interfaces/IRecentPages';

import { CommandBar, FocusZone, List, IContextualMenuItem, ContextualMenuItemType, IRectangle, css } from 'office-ui-fabric-react';

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;

export default class RecentPages extends React.Component<IRecentPagesProps, IRecentPagesState> {

  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;

  constructor() {
    super();

    // Initiate the component state
    this.state = {
      isLoading: true,
      pageItems: []
    };

    this._getItemCountForPage = this._getItemCountForPage.bind(this);
    this._getPageHeight = this._getPageHeight.bind(this);
  }

  private update() {
    console.log(`update called`);
  }

  public componentWillUpdate() {
    console.log(`component will update called`);
  }

  public componentDidMount() {
    this.setState({ isLoading: true });

    recentPagesHelper.getRecentPagesMenu(this.props.size, this.props.context).then(data => {
      this.setState({
        isLoading: false,
        pageItems: data
      });
    });
  }

  public render(): React.ReactElement<IRecentPagesProps> {

    if (this.state.isLoading) {
      return (
        <div className={styles.recentPages}>
        </div>
      );
    }

    let layout = (this.props.layout);
    console.log(layout);

    if (layout === "Dropdown") {
      return (
        <div className={styles.recentPages}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <CommandBar className='asd' items={this.state.pageItems} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (layout === "List") {

      let pageItems = this.state.pageItems[0].subMenuProps.items;
      console.log(pageItems);

      return (
        <div className={styles.recentPages}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <FocusZone>
                  <List className='ms-ListGridExample'
                    items={pageItems}
                    renderedWindowsAhead={4}
                    onRenderCell={this._onRenderCellItem} />
                </FocusZone>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={styles.recentPages}>
          <div className={styles.container}>
          </div>
        </div>
      );
    }

  }

  private _getItemCountForPage(itemIndex: number, surfaceRect: IRectangle) {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  }

  private _getPageHeight(itemIndex: number, surfaceRect: IRectangle) {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  private _onRenderCellItem = (item: any, index: number | undefined): JSX.Element => {

    console.log(item);

    return (
      <div className='ms-ListGridExample-tile'
        data-is-focusable={true}
        style={{ width: (100 / this._columnCount) + '%' }} >
        <div className='ms-ListGridExample-sizer'>
          <div className='msListGridExample-padder'>
            <a href={item.href} className={css('ms-Button', styles.button)}>
              <span className='ms-ListGridExample-label'>{`${item.name}`}</span>
            </a>
          </div >
        </div >
      </div >
    );
  }


}
