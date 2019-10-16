import { Theme, Box } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { Loading, showAlert } from 'components';
import { fetchStarterPacksData } from 'api/googleSheets';
import { StarterPack } from 'models/googleSheets';
import { StarterPacksList, StarterPackDetails, StarterPacksToolbar } from './components';


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
  }
});

interface Props {
  emailAddress: string;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
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

  private applySelectedStarterPacks = () => {
    debugger;
    // TODO implement filter selected starter packs
    // TODO implement send request to the backend
    // TODO What should be the format?
    /* TODO How transactional should it be?
       - Should it fail when one trigger is taken?
       - It should definitely return an error
       - Then maybe admin should review snippets tab and delete conflicting snippets and apply starter pack again?
       - This sounds better than overriding existing snippets (by accident)
    */

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

  public render() {
    const { classes, emailAddress } = this.props;
    const {
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
