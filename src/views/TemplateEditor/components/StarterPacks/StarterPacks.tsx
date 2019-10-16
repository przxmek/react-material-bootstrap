import { Theme, Box, Typography, Button } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { Loading, showAlert } from 'components';
import { fetchStarterPacksData } from 'api/googleSheets';
import { StarterPack } from 'models/googleSheets';
import { StarterPacksList, StarterPackDetails, StarterPacksToolbar } from './components';
import { createOrUpdateSnippetBatch } from 'api/prometheus';
import { PrometheusTemplate } from 'models/templates';
import JSONTree from 'react-json-tree';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
    flex: '0 1 auto',
    maxHeight: 680,
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
  },
  errorWrapper: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    wordWrap: 'break-word',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  }
});

interface Props {
  emailAddress: string;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  error?: { message: string, details: string };
  starterPacks?: StarterPack[];
  selectedItem?: StarterPack;
  selectedStarterPacks: string[];
  loading: boolean;
}

class StarterPacks extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      loading: false,
      selectedStarterPacks: [],
    };
  }

  public componentDidMount = async () => {
    await this.reloadStarterPacksData();
  }

  private reloadStarterPacksData = async () => {
    this.setState({
      loading: true,
      selectedItem: undefined,
      selectedStarterPacks: []
    });

    try {
      const starterPacks = await fetchStarterPacksData();
      this.setState({ starterPacks, loading: false });
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.setState({ loading: false });
    }
  }

  private applySelectedStarterPacks = async () => {
    const { emailAddress } = this.props;
    const { starterPacks, selectedStarterPacks } = this.state;

    if (!starterPacks) {
      showAlert("error", "Please refresh and try again.");
      return;
    }

    if (selectedStarterPacks.length === 0) {
      showAlert("error", "No starter packs selected.");
      return;
    }

    const filtered = starterPacks.filter(sp => selectedStarterPacks.includes(sp.name));
    const converted: Array<{ name: string, request: PrometheusTemplate[] }> =
      filtered.map(sp => ({
        name: sp.name,
        request: sp.snippets.map(snippet => ({
          trigger: snippet.trigger,
          text: snippet.text,
          labels: [sp.name],
          type: "prometheusSnippet"
        })),
      })
      );

    for (const batch of converted) {
      try {
        const response = await createOrUpdateSnippetBatch(emailAddress, batch.request);
        if ('error' in response) {
          showAlert("error", `Failed to store starter pack '${batch.name}': ${response.error}`);
          const error = {
            message: response.error,
            details: response.results,
          };
          this.setState({ error });
        } else {
          showAlert("success", `Starter pack '${batch.name}' saved!`);
        }
      } catch (e) {
        showAlert("error", `Failed to store starter pack '${batch.name}'. ${e}`);
      }
    }
  }

  private onListItemSelected = (item: StarterPack) => {
    this.setState({ selectedItem: item });
  }

  private onStarterPackToggle = (starterPackName: string) => {
    const {
      selectedStarterPacks
    } = this.state;

    const currentIndex = selectedStarterPacks.indexOf(starterPackName);
    const newSelectedStarterPacks = [...selectedStarterPacks];

    if (currentIndex === -1) {
      newSelectedStarterPacks.push(starterPackName);
    } else {
      newSelectedStarterPacks.splice(currentIndex, 1);
    }

    this.setState({ selectedStarterPacks: newSelectedStarterPacks });
  }

  private renderErrorMessage = () => {
    const { classes } = this.props;
    const { error } = this.state;

    const theme = {
      scheme: 'monokai',
      author: 'wimer hazenberg (http://www.monokai.nl)',
      base00: '#272822',
      base01: '#383830',
      base02: '#49483e',
      base03: '#75715e',
      base04: '#a59f85',
      base05: '#f8f8f2',
      base06: '#f5f4f1',
      base07: '#f9f8f5',
      base08: '#f92672',
      base09: '#fd971f',
      base0A: '#f4bf75',
      base0B: '#a6e22e',
      base0C: '#a1efe4',
      base0D: '#66d9ef',
      base0E: '#ae81ff',
      base0F: '#cc6633'
    };

    if (!error) {
      return null;
    }

    return (
      <div className={classes.errorWrapper}>
        <Typography color="error" variant="h3">{error.message}</Typography>
        <JSONTree data={error.details} theme={theme} invertTheme={false} />
        <Button
          color="primary"
          variant="outlined"
          onClick={() => this.setState({ error: undefined })}
        >
          Dismiss
        </Button>
      </div>
    );
  }

  public render() {
    const { classes, emailAddress } = this.props;
    const {
      error,
      loading,
      selectedItem,
      selectedStarterPacks,
      starterPacks
    } = this.state;

    if (loading) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <StarterPacksToolbar
          emailAddress={emailAddress}
          onApplyAll={this.applySelectedStarterPacks}
          onRefresh={this.reloadStarterPacksData}
        />
        <Box
          display="flex"
          flexDirection="row"
          className={classes.content}
        >
          <StarterPacksList
            onItemSelected={this.onListItemSelected}
            onStarterPackToggle={this.onStarterPackToggle}
            selectedItem={selectedItem}
            selectedStarterPacks={selectedStarterPacks}
            starterPacks={starterPacks}
          />

          <Box flexGrow={1} className={classes.rightContent}>
            {error && this.renderErrorMessage()}
            <StarterPackDetails
              starterPack={selectedItem}
            />
          </Box>

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(StarterPacks);
