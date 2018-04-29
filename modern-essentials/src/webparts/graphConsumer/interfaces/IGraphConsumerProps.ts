import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ClientMode } from './../helpers/ClientMode';

export interface IGraphConsumerProps {
  clientMode: ClientMode;
  context: WebPartContext;
}
