import { Box, Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { SnippetsList, RichTextEditor } from './components';
import { Loading, showAlert } from 'components';
import { Template, PrometheusTemplate } from 'models/templates';
import { fetchSnippets } from 'api/prometheus';


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

  selectedItem?: Template;

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
    const { emailAddress } = this.props;

    this.loadPrometheusData(emailAddress);
  }

  private loadPrometheusData = async (emailAddress: string) => {
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
    this.setState({ selectedItem: item });
  }

  private onSelectedItemSave = (newText: string, newTrigger: string, template?: Template) => {
    const { selectedItem } = this.state;


    if (!selectedItem && !template) {
      // TODO save new custom template
      return;
    }

    if (!selectedItem || !template) {
      return;
    }

    const selectedType = selectedItem.type;

    if (selectedType === "prometheusSnippet" && this.state.prometheusSnippets) {
      const prometheusSnippets = this.state.prometheusSnippets.slice();
      const idx = prometheusSnippets.indexOf(template as PrometheusTemplate);

      prometheusSnippets[idx].text = newText;
      prometheusSnippets[idx].trigger = newTrigger;

      this.setState({ prometheusSnippets });
    }
  }

  private onSelectedItemApply = async (text: string, trigger: string, snippet?: Template) => {
    const { emailAddress } = this.props;

    if (snippet) {
      this.onSelectedItemSave(text, trigger, snippet);
    }

    const snippets = snippet ? [snippet] : [{ trigger, text }];

    showAlert("info", "Processing...", 5000);

    // const response = await applySnippets(emailAddress, snippets);
    // if (response.status === 'failure') {
    //   showAlert("error", `Failed to apply snippet: ${response.message}`, 30000);
    // } else {
    //   const status = response.result[0].status;
    //   if (status === 'added') {
    //     showAlert("success", "Snippet added to Prometheus profile", 5000);
    //   } else {
    //     showAlert("error", `Failed to apply snippet: ${status}`, 30000);
    //   }
    // }
  }

  private onSelectedItemRemove = (snippet: Template) => {
    const {
      selectedItem,
      prometheusSnippets
    } = this.state;

    if (!selectedItem) {
      return;
    }

    const selectedType = selectedItem.type;
    const trigger = snippet.trigger;

    if (selectedType === 'prometheusSnippet' && prometheusSnippets) {
      this.setState({
        prometheusSnippets: prometheusSnippets.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
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
            groups={[{name: 'Prometheus snippets', items: prometheusSnippets}]}
            selectedItem={selectedItem}
            onItemSelected={this.onListItemSelected}
          />

          <Box flexGrow={1} className={classes.rightContent}>
            <RichTextEditor
              snippet={selectedItem}
              onApply={this.onSelectedItemApply}
              onRemove={this.onSelectedItemRemove}
              onSave={this.onSelectedItemSave}
            />
          </Box>

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(PrometheusEditor);
