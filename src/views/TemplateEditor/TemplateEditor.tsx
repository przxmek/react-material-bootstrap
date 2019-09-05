import { Box, Theme, Typography } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { fetchSnippets, fetchTemplates, generateSnippets, generateTemplates } from 'api/snippetGenerator';
import { HandwrittenEmail, Snippet, Template } from 'models/snippetGenerator';

import { SnippetsList, TemplateEditorToolbar, RichTextEditor } from './components';


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

export type ItemType = 'snippet' | 'template' | 'handwrittenEmail';
interface State {
  handwrittenEmails?: HandwrittenEmail[];
  snippets?: Snippet[];
  templates?: Template[];
  selectedItem?: string;
  selectedType?: ItemType;
}

class TemplateEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      handwrittenEmails: undefined,
      snippets: undefined,
      templates: undefined,
      selectedItem: undefined,
      selectedType: undefined
    };
  }

  public componentDidMount = async () => {
    const { emailAddress } = this.props.match.params;

    const templatesResponse = await fetchTemplates(emailAddress);
    const templates = templatesResponse.templates ? templatesResponse.templates : [];
    const handwrittenEmails = templatesResponse.handwritten_emails ? templatesResponse.handwritten_emails : [];
    const snippets = await fetchSnippets(emailAddress);

    // debugger;

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

  private onListItemSelected = (item: string, type: ItemType) => {
    this.setState({ selectedType: type, selectedItem: item });
  }

  private onSelectedItemTextChange = (text: string) => {
    const { selectedType, selectedItem } = this.state;

    if (!selectedType || !selectedItem) {
      return;
    }

    if (selectedType === 'handwrittenEmail' && this.state.handwrittenEmails) {
      const handwrittenEmails = this.state.handwrittenEmails.slice();
      const idx = handwrittenEmails.indexOf(selectedItem);
      handwrittenEmails[idx] = text;
      this.setState({ handwrittenEmails, selectedItem: text });
    } else if (selectedType === 'snippet' && this.state.snippets) {
      const snippets = this.state.snippets.slice();
      const idx = snippets.indexOf(selectedItem);
      snippets[idx] = text;
      this.setState({ snippets, selectedItem: text });
    } else if (selectedType === 'template' && this.state.templates) {
      const templates = this.state.templates.slice();
      const idx = templates.indexOf(selectedItem);
      templates[idx] = text;
      this.setState({ templates, selectedItem: text });
    }
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
            <RichTextEditor text={selectedItem} onTextChange={this.onSelectedItemTextChange} />
          )}

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
