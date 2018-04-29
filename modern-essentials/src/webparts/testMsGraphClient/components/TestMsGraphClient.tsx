import * as React from 'react';
import styles from './../styles/TestMsGraphClient.module.scss';
import { ITestMsGraphClientProps } from './../interfaces/ITestMsGraphClient';
import { escape } from '@microsoft/sp-lodash-subset';

import graphClientHelper from './../../../common/helpers/MSGraphClientHelper';

export default class TestMsGraphClient extends React.Component<ITestMsGraphClientProps, {}> {

  constructor() {
    super();

  }

  private update() {
    console.log(`TestMsGraphClient: update called`);
  }

  public componentDidMount() {

    console.log(`TestMsGraphClient: componentWillMount`);
    console.log(`asd 123`);
    console.log(this.props.context);

    graphClientHelper.getSomeStuffUsingGraph(this.props.context);

  }

  public componentWillUpdate() {
    console.log(`TestMsGraphClient: component will update called`);
  }

  public render(): React.ReactElement<ITestMsGraphClientProps> {
    return (
      <div className={styles.testMsGraphClient}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
