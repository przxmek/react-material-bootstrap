import { Box, Theme, Typography } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SnippetsList, TemplateEditorToolbar, RichTextEditor } from './components';
import { Loading } from 'components';
import { PrometheusSnippet } from 'models/prometheus';
import { fetchSnippets } from 'api/prometheus';


const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
});

interface PathParamsType {
  emailAddress: string;
}

type PropsType = WithStyles<typeof styles> & RouteComponentProps<PathParamsType>;

interface State {
  snippets?: PrometheusSnippet[];
  selectedItem?: PrometheusSnippet;
}

class Prometheus extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      snippets: undefined,
      selectedItem: undefined
    };
  }

  public componentDidMount = async () => {
    const { emailAddress } = this.props.match.params;

    const response = await fetchSnippets(emailAddress);
    const snippets = [...response.custom, ...response.generated];

    this.setState({ snippets });
  }

  private onListItemSelected = (selectedItem: PrometheusSnippet) => {
    this.setState({ selectedItem });
  }

  public render() {
    const { classes } = this.props;
    const { snippets, selectedItem } = this.state;

    if (!snippets) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <TemplateEditorToolbar
          onApplyAll={() => { /* @TODO */ }}
          onGenerateSnippets={() => { /* @TODO */ }}
          onGenerateTemplates={() => { /* @TODO */ }}
        />
        <Box
          display="flex"
          flexDirection="row"
          className={classes.content}
        >
          <SnippetsList
            snippets={snippets}
            selectedItem={selectedItem}
            onItemSelected={this.onListItemSelected}
          />

          {!selectedItem && (
            <Typography>Select an item from the list first.</Typography>
          )}
          {selectedItem && (
            <RichTextEditor
              snippet={selectedItem}
              onApply={() => { /* TODO */ }}
              onRemove={() => { /* TODO */ }}
              onSave={() => { /* TODO */ }}
            />
          )}

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(Prometheus);
