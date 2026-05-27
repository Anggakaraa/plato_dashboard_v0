import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import store from "./store";
import { UserProvider } from "./context/user-access.context"

const render = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  );
};

if (import.meta.env.VITE_ENV === 'mock') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' }).then(render);
  });
} else {
  render();
}

serviceWorker.unregister()