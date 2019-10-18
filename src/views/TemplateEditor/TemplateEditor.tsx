import { Tab } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';
import SnippetGeneratorEditor from './SnippetGeneratorEditor';
import PrometheusSnippetsEditor from './PrometheusSnippetsEditor';
import PrometheusSuggestionsEditor from './PrometheusSuggestionsEditor';
import { TabMenu } from 'components';
import { StarterPacks } from './components';
import { Link as RouterLink } from 'react-router-dom';

interface PathParamsType {
  emailAddress: string;
}

type PropsType = RouteComponentProps<PathParamsType>;

interface State {
  activeTab: string;
}

class TemplateEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    const activeTab = this.props.location.pathname.split('/').slice(-1)[0];

    this.state = {
      activeTab,
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const activeTab = this.props.location.pathname.split('/').slice(-1)[0];
      this.setState({activeTab});
    }
  }

  private handleChangeTab = (activeTab: string) => {
    this.setState({ activeTab });
  }

  public render() {
    const { url } = this.props.match;
    const { emailAddress } = this.props.match.params;
    const { activeTab } = this.state;

    return (<>
      <TabMenu
        activeTab={activeTab}
        onChange={this.handleChangeTab}
      >
        <Tab
          id="tab-prometheus-snippets"
          value="prometheus-snippets"
          label="Prometheus snippets"
          component={RouterLink}
          to={`${url}/prometheus-snippets`}
        />
        <Tab
          id="tab-prometheus-autocomplete"
          value="prometheus-autocomplete"
          label="Prometheus suggestions"
          component={RouterLink}
          to={`${url}/prometheus-autocomplete`}
        />
        <Tab
          id="tab-snippet-generator"
          value="snippet-generator"
          label="Snippet Generator"
          component={RouterLink}
          to={`${url}/snippet-generator`}
        />
        {/* Icons: FilterNone, LibraryBooks, MenuBook */}
        <Tab
          id="tab-starter-packs"
          value="starter-packs"
          // icon={<MenuBookIcon />}
          label="Starter packs"
          component={RouterLink}
          to={`${url}/starter-packs`}
        />
      </TabMenu>
      <Switch>
        <Route
          exact path={`${url}/prometheus-snippets`}
          render={() => <PrometheusSnippetsEditor emailAddress={emailAddress} />}
          emailAddress={emailAddress}
        />
        <Route
          exact path={`${url}/prometheus-autocomplete`}
          render={() => <PrometheusSuggestionsEditor emailAddress={emailAddress} />}
          emailAddress={emailAddress}
        />
        <Route
          exact path={`${url}/snippet-generator`}
          render={() => <SnippetGeneratorEditor emailAddress={emailAddress} />}
          emailAddress={emailAddress}
        />
        <Route
          exact path={`${url}/starter-packs`}
          render={() => <StarterPacks emailAddress={emailAddress} />}
          emailAddress={emailAddress}
        />
        <Redirect exact from={url} to={`${url}/prometheus-snippets`} />
        <Redirect to="/not-found" />
      </Switch>
    </>
    );
  }
}

export default TemplateEditor;
