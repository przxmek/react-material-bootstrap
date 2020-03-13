import { Box, Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { Loading, showAlert } from 'components';
import { fetchSuggestions } from 'api/prometheus';
import { PrometheusSuggestion } from 'models/prometheus';
import SuggestionsList from './components/SuggestionsList';

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
  customSuggestions?: PrometheusSuggestion[];
  generatedSuggestions?: PrometheusSuggestion[];
  defaultSuggestions?: PrometheusSuggestion[];

  loaded: boolean;
}

class PrometheusSuggestionsEditor extends React.Component<PropsType, State> {
  public state: State = {
    loaded: false,
  };

  public componentDidMount = async () => {
    this.loadPrometheusData();
  }

  private loadPrometheusData = async () => {
    const { emailAddress } = this.props;

    try {
      const response = await fetchSuggestions(emailAddress);
      const {
        custom: customSuggestions,
        generated: generatedSuggestions,
        default: defaultSuggestions
      } = response;

      this.setState({
        loaded: true,
        customSuggestions,
        generatedSuggestions,
        defaultSuggestions,
      });

    } catch (e) {
      showAlert("error", e.message, 10000);
      this.setState({ loaded: true });
    }
  }

  public render() {
    const { classes } = this.props;
    const {
      customSuggestions,
      defaultSuggestions,
      generatedSuggestions,
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
          <SuggestionsList
            groups={[
              { name: 'Custom suggestions', items: customSuggestions },
              { name: 'Generated suggestions', items: generatedSuggestions },
              { name: 'Default suggestions', items: defaultSuggestions },
            ]}
          />
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(PrometheusSuggestionsEditor);
