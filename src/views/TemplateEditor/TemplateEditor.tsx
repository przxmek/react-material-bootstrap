import { Tab, Grow } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SnippetGeneratorEditor from './SnippetGeneratorEditor';
import PrometheusSnippetsEditor from './PrometheusSnippetsEditor';
import PrometheusSuggestionsEditor from './PrometheusSuggestionsEditor';
import { TabMenu } from 'components';
import { StarterPacks } from './components';

interface PathParamsType {
  emailAddress: string;
}

type PropsType = RouteComponentProps<PathParamsType>;

interface State {
  activeTab: number;
}

class TemplateEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      activeTab: 1,
    };
  }

  private handleChangeTab = (activeTab: number) => {
    this.setState({ activeTab });
  }

  public render() {
    const { emailAddress } = this.props.match.params;
    const {
      activeTab,
    } = this.state;

    return (<>
      <TabMenu
        activeTab={activeTab}
        onChange={this.handleChangeTab}
      >
        <Tab
          id="tab-prometheus-snippets"
          value={1}
          label="Prometheus snippets"
        />
        <Tab
          id="tab-prometheus-autocomplete"
          value={2}
          label="Prometheus suggestions"
        />
        <Tab
          id="tab-snippet-generator"
          value={3}
          label="Snippet Generator"
        />
        {/* Icons: FilterNone, LibraryBooks, MenuBook */}
        <Tab
          id="tab-starter-packs"
          // icon={<MenuBookIcon />}
          value={4}
          label="Starter packs"
        />
      </TabMenu>
      <Grow in={activeTab === 1} mountOnEnter unmountOnExit>
        <PrometheusSnippetsEditor emailAddress={emailAddress} />
      </Grow>
      <Grow in={activeTab === 2} mountOnEnter unmountOnExit>
        <PrometheusSuggestionsEditor emailAddress={emailAddress} />
      </Grow>
      <Grow in={activeTab === 3} mountOnEnter unmountOnExit>
        <SnippetGeneratorEditor emailAddress={emailAddress} />
      </Grow>
      <Grow in={activeTab === 4} mountOnEnter unmountOnExit>
        <StarterPacks emailAddress={emailAddress} />
      </Grow>
    </>
    );
  }
}

export default TemplateEditor;
