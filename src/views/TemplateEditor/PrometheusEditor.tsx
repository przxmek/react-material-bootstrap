import { Box, Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { SnippetsList, RichTextEditor } from './components';
import { Loading, showAlert } from 'components';
import { Template, PrometheusTemplate } from 'models/templates';
import { fetchSnippets, createOrUpdateSnippet, deleteSnippet } from 'api/prometheus';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
    flex: '0 1 auto',
    maxHeight: 700,
  },
  rightContent: {
    marginLeft: theme.spacing(),
  },
  noItem: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    textAlign: 'center',
    height: '100%',
  }
});

interface Props {
  emailAddress: string;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  prometheusSnippets?: PrometheusTemplate[];
  selectedItem?: PrometheusTemplate;
  loaded: boolean;
}

class PrometheusEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      prometheusSnippets: undefined,

      selectedItem: undefined,

      loaded: false,
    };
  }

  public componentDidMount = async () => {
    this.loadPrometheusData();
  }

  private loadPrometheusData = async () => {
    const { emailAddress } = this.props;

    try {
      const response = await fetchSnippets(emailAddress);
      const prometheusSnippets = [...response.custom, ...response.generated];
      this.setState({ loaded: true, prometheusSnippets });
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.setState({ loaded: true });
    }
  }

  private onListItemSelected = (item: Template) => {
    this.setState({ selectedItem: item as PrometheusTemplate });
  }

  private createSnippet = async (text: string, trigger: string, labels?: string[]) => {
    const { emailAddress } = this.props;
    const { prometheusSnippets } = this.state;

    try {
      const snippet: PrometheusTemplate = {
        type: 'prometheusSnippet',
        text,
        trigger,
        labels: labels ? labels : [],
      };

      const newSnippet = await createOrUpdateSnippet(emailAddress, snippet);

      const newPrometheusSnippets: PrometheusTemplate[] =
        prometheusSnippets ? prometheusSnippets.slice() : [];

      newPrometheusSnippets.unshift(newSnippet);

      this.setState({
        prometheusSnippets: newPrometheusSnippets,
        selectedItem: newSnippet
      });

      showAlert("success", `Snippet '${trigger}' created!`);
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.loadPrometheusData();
    }
  }

  private updateSnippet = async (text: string, trigger: string, labels?: string[]) => {
    const { emailAddress } = this.props;
    const { selectedItem, prometheusSnippets } = this.state;

    if (!selectedItem || !prometheusSnippets) {
      showAlert("error", "Something went wrong when saving 😫", 10000);
      return;
    }

    const newPrometheusSnippets = prometheusSnippets.slice();
    const idx = newPrometheusSnippets.indexOf(selectedItem);
    const snippet = newPrometheusSnippets[idx];

    newPrometheusSnippets[idx].trigger = trigger;
    newPrometheusSnippets[idx].text = text;
    if (labels) {
      newPrometheusSnippets[idx].labels = labels;
    }

    this.setState({ prometheusSnippets: newPrometheusSnippets });

    // Update Prometheus
    try {
      await createOrUpdateSnippet(emailAddress, snippet);
      showAlert("success", `Snippet '${trigger}' updated!`);
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.loadPrometheusData();
    }
  }

  private onSave = async (text: string, trigger: string, labels?: string[]) => {
    const { selectedItem } = this.state;

    showAlert("info", "Processing...", 5000);

    if (!selectedItem) {
      await this.createSnippet(text, trigger, labels);
    } else {
      await this.updateSnippet(text, trigger, labels);
    }
  }

  private onSelectedItemRemove = async () => {
    const { emailAddress } = this.props;
    const { selectedItem, prometheusSnippets } = this.state;

    if (!selectedItem || !selectedItem.id_ || !prometheusSnippets) {
      showAlert("error", "Something went wrong when removing 😫", 10000);
      return;
    }

    showAlert("info", "Deleting...", 5000);

    this.setState({
      prometheusSnippets: prometheusSnippets.slice().filter(s => s.trigger !== selectedItem.trigger),
      selectedItem: undefined
    });

    try {
      // Update Prometheus
      await deleteSnippet(emailAddress, selectedItem.id_);
      showAlert("success", `Snippet '${selectedItem.trigger}' deleted!`);
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.loadPrometheusData();
    }
  }

  public render() {
    const { classes } = this.props;
    const {
      prometheusSnippets,
      selectedItem,
      loaded
    } = this.state;

    if (!loaded) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <Box
          display="flex"
          flexDirection="row"
          className={classes.content}
        >
          <SnippetsList
            groups={[{ name: 'Prometheus snippets', items: prometheusSnippets }]}
            selectedItem={selectedItem}
            onItemSelected={this.onListItemSelected}
          />

          <Box flexGrow={1} className={classes.rightContent}>
            <RichTextEditor
              snippet={selectedItem}
              onRemove={this.onSelectedItemRemove}
              onSave={this.onSave}
            />
          </Box>

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(PrometheusEditor);
