import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'RecentPagesWebPartStrings';
import RecentPages from './components/RecentPages';
import { IRecentPagesProps } from './../../interfaces/IRecentPages';

import { PropertyPaneSlider, PropertyPaneChoiceGroup, IPropertyPaneChoiceGroupOption } from '@microsoft/sp-webpart-base';

export interface IRecentPagesWebPartProps {
  description: string;
  size: number;
  layout: any;
}

export default class RecentPagesWebPart extends BaseClientSideWebPart<IRecentPagesWebPartProps> {
  
  constructor() {
    super();

    
  }

  public render(): void {

    console.log(this.context);

    const element: React.ReactElement<IRecentPagesProps> = React.createElement(
      RecentPages,
      {
        context: this.context,
        description: this.properties.description,
        size: this.properties.size,
        layout: this.properties.layout
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider('size', {
                  label: "Maximum Pages",
                  min: 0,
                  max: 10,
                  step: 1,
                  showValue: true,
                  value: 10
                }),
                PropertyPaneChoiceGroup('layout', {
                  label: "Results layout",
                  options: recentPagesLayouts
                })
              ]
            }
          ]
        }
      ]
    };
  }
  
}

export const recentPagesLayouts: IPropertyPaneChoiceGroupOption[] = [
  {
    key: "Dropdown",
    text: "Dropdown",
    imageSize: {
      width: 35,
      height: 35
    },
    imageSrc: 'white.png',
    selectedImageSrc: 'white.png'
  },
  {
    key: "List",
    text: "List",
    imageSize: {
      width: 35,
      height: 35
    },
    imageSrc: 'black.png',
    selectedImageSrc: 'black.png',
  },
  {
    key: "Doodle",
    text: "Doodle",
    imageSize: {
      width: 35,
      height: 35
    },
    imageSrc: 'blue.png',
    selectedImageSrc: 'blue.png'
  }
];

