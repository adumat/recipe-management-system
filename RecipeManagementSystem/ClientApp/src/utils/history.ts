import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

export const goBack = () =>
  window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf('/'),
  );
