import { Theme, Typography, Box } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { fetchSnippets, generateSnippets, fetchTemplates, generateTemplates } from 'api/snippetGenerator';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { TemplateEditorToolbar, SnippetsList } from './components';
import { Template, Snippet, HandwrittenEmail } from 'models/snippetGenerator';

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
  handwrittenEmails?: HandwrittenEmail[];
  snippets?: Snippet[];
  templates?: Template[];
  selectedItem?: any;
}

class TemplateEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      handwrittenEmails: undefined,
      snippets: undefined,
      templates: undefined,
      selectedItem: undefined,
    };
  }

  public componentDidMount = async () => {
    const { emailAddress } = this.props.match.params;

    const templatesResponse = await fetchTemplates(emailAddress);
    const templates = templatesResponse.templates;
    const handwrittenEmails = templatesResponse.handwritten_emails;
    const snippets = await fetchSnippets(emailAddress);

    this.setState({ handwrittenEmails, templates, snippets });
  }

  private generateNewTemplates = async () => {
    const { emailAddress } = this.props.match.params;
    const templatesResponse = await generateTemplates(emailAddress);
    const templates = templatesResponse.templates;
    const handwrittenEmails = templatesResponse.handwritten_emails;
    this.setState({ handwrittenEmails, templates });
  }

  private generateNewSnippets = async () => {
    const { emailAddress } = this.props.match.params;
    const snippets = await generateSnippets(emailAddress);
    this.setState({ snippets });
  }

  private onListItemSelected = (item: any) => {
    this.setState({ selectedItem: item });
  }

  public render() {
    const { classes } = this.props;
    const { handwrittenEmails, snippets, templates, selectedItem } = this.state;

    if (!handwrittenEmails || !snippets || !templates) {
      return (
        <h1>Loading..</h1>
      );
    }

    return (
      <div className={classes.root}>
        <TemplateEditorToolbar
          onGenerateSnippets={this.generateNewSnippets}
          onGenerateTemplates={this.generateNewTemplates}
        />
        <Box
          display="flex"
          flexDirection="row"
          className={classes.content}
        >
          <SnippetsList
            handwrittenEmails={handwrittenEmails}
            snippets={snippets}
            templates={templates}
            onItemSelected={this.onListItemSelected}
          />

          {!selectedItem && (
            <Typography>Select an item from the list first.</Typography>
          )}
          {selectedItem && (
            <Typography>{selectedItem}</Typography>
          )}

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
