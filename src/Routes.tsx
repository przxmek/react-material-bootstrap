import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { RouteWithLayout } from './components';
import {
  Main as MainLayout,
  Minimal as MinimalLayout
} from './layouts';
import {
  Account as AccountView,
  Dashboard as DashboardView,
  NotFound as NotFoundView,
  ProductList as ProductListView,
  Settings as SettingsView,
  SignIn as SignInView,
  SignUp as SignUpView,
  TemplateEditor as TemplateEditorView,
  UserList as UserListView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/users"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account/:emailAddress"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={TemplateEditorView}
        layout={MainLayout}
        path="/template-editor/:emailAddress"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
