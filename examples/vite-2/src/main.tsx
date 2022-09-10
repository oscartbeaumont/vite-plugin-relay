import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { RelayEnvironmentProvider } from "react-relay";
import { RelayEnvironment } from "./relay";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={<h1>Loading Data...</h1>}>
        <App />
      </Suspense>
    </RelayEnvironmentProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
