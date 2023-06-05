import * as React from "react";
import { Admin, CustomRoutes, Resource, fetchUtils } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Route } from "react-router";
import { authProvider } from "ra-nest-rest";
import { Login, Layout } from "./layout";
import { Dashboard } from "./dashboard";
import englishMessages from "./i18n/en";
import { lightTheme } from "./layout/themes";
import Configuration from "./configuration/Configuration";
import dataProvider from "ra-nest-rest";
import postjobs from "./postjobs";
import jobbids from "./jobbids";
import jobtasks from "./jobtasks";
import FetchGithub from "./tools/fetchGithub";
import FetchCardano from "./tools/fetchCardano";
import { MeshProvider } from "@meshsdk/react";
import ParseAddress from "./tools/parseAddress";
import plutustxs from "./plutustxs";
import { PostedJobReport } from "./postedjobreports";
import { PaymentReport } from "./paymentreports";
import Wallet from "./wallet/wallet";
import ChangePassword from "./components/changePassword";

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const apiUrl = process.env.REACT_APP_API_URL;
const renewTokenUrl = process.env.REACT_APP_RENEW_ACCESS_TOKEN_URL;
const logoutUrl = process.env.REACT_APP_LOGOUT_URL;

const _authProvider = authProvider(loginUrl, renewTokenUrl, logoutUrl);
const restProvider = dataProvider(apiUrl);

const i18nProvider = polyglotI18nProvider((locale) => {
  if (locale === "fr") {
    return import("./i18n/fr").then((messages) => messages.default);
  }
  // Always fallback on english
  return englishMessages;
}, "en");

const App = () => {
  return (
    <MeshProvider>
      <Admin
        title="bWorks"
        dataProvider={restProvider}
        authProvider={_authProvider}
        dashboard={Dashboard}
        loginPage={Login}
        layout={Layout}
        i18nProvider={i18nProvider}
        disableTelemetry
        theme={lightTheme}
      >
        <CustomRoutes>
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/fetchCardano" element={<FetchCardano />} />
          <Route path="/fetchGithub" element={<FetchGithub />} />
          <Route path="/parseaddress" element={<ParseAddress />} />
          <Route path="/postedjobreport" element={<PostedJobReport />} />
          <Route path="/paymentreport" element={<PaymentReport />} />
          <Route path="/wallets" element={<Wallet />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </CustomRoutes>
        <Resource name="postjobs" {...postjobs} />
        <Resource name="jobbids" {...jobbids} />
        <Resource name="jobtasks" {...jobtasks} />
        <Resource name="plutustxs" {...plutustxs} />
      </Admin>
    </MeshProvider>
  );
};

export default App;
