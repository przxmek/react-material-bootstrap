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
import { reformatText } from 'common/text';

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
  statusWrapper: {
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

interface SuccessResult {
  success: true;
  name: string;
}
interface ErrorResult {
  success: false;
  name: string;
  message: string;
  details: string;
}
interface StatusType {
  success: boolean;
  results: Array<SuccessResult | ErrorResult>;
}

interface State {
  status?: StatusType;
  starterPacks?: StarterPack[];
  selectedItem?: StarterPack;
  selectedStarterPacks: string[];
  loading: boolean;
  savingStarterPacks: boolean;
}

class StarterPacks extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      selectedStarterPacks: [],
      loading: false,
      savingStarterPacks: false,
    };
  }

  public componentDidMount = async () => {
    await this.reloadStarterPacksData();
  }

  private reloadStarterPacksData = async () => {
    this.setState({
      selectedItem: undefined,
      selectedStarterPacks: [],
      loading: true,
      savingStarterPacks: false,
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

    showAlert("info", `Saving ${selectedStarterPacks.length} starter pack(s)...`, 15000);
    this.setState({ savingStarterPacks: true });

    const filtered = starterPacks.filter(sp => selectedStarterPacks.includes(sp.name));
    const converted: Array<{ name: string, request: PrometheusTemplate[] }> =
      filtered.map(sp => ({
        name: sp.name,
        request: sp.snippets.map(snippet => ({
          trigger: snippet.trigger,
          text: reformatText(snippet.text),
          labels: [sp.name],
          type: "prometheusSnippet"
        })),
      }));

    const results: Array<{ name: string, response?: any, error?: string }> = [];

    for (const batch of converted) {
      try {
        const response = await createOrUpdateSnippetBatch(emailAddress, batch.request);
        results.push({ name: batch.name, response });
      } catch (e) {
        results.push({
          name: batch.name,
          response: {
            error: `Failed to store starter pack '${batch.name}'. ${e}`,
            results: `Failed to store starter pack '${batch.name}'. ${e}`
          }
        });
        showAlert("error", `Failed to store starter pack '${batch.name}'.`);
      }
    }

    const status: StatusType = {
      success: true,
      results: [],
    };

    for (const r of results) {
      if (r.response.error) {
        status.success = false;
        status.results.push({
          success: false,
          name: r.name,
          message: r.response.error,
          details: r.response.results,
        });
      } else {
        status.results.push({
          success: true,
          name: r.name,
        });
      }
    }

    if (status.success) {
      showAlert("success", `Saved ${selectedStarterPacks.length} starter pack(s)!`, 15000);
    } else {
      showAlert("error", `Saving some of chosen starter packs failed! 😣`, 15000);
    }

    this.setState({ status, savingStarterPacks: false });
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

  private renderStatusMessage = () => {
    const { classes } = this.props;
    const { status } = this.state;

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

    if (!status) {
      return null;
    }

    return (
      <div className={classes.statusWrapper}>
        {status.success && (
          <Typography color="primary" variant="h3">All starter packs saved successfully!</Typography>
        )}
        {!status.success && (
          <Typography color="error" variant="h3">Saving some of the starter packs failed!</Typography>
        )}
        <JSONTree data={status} theme={theme} invertTheme={false} />
        <Button
          color="primary"
          variant="outlined"
          onClick={() => this.setState({ status: undefined })}
        >
          Dismiss
        </Button>
      </div>
    );
  }

  public render() {
    const { classes, emailAddress } = this.props;
    const {
      loading,
      selectedItem,
      selectedStarterPacks,
      starterPacks,
      status,
      savingStarterPacks,
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
          saving={savingStarterPacks}
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
            {status && this.renderStatusMessage()}
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
