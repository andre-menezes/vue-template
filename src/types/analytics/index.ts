export type GtagCommand = 'config' | 'event' | 'set' | 'js';

export interface GtagEventParams {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  [key: string]: unknown;
}

export type Gtag = (command: GtagCommand, targetOrEvent: string, params?: GtagEventParams) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}
