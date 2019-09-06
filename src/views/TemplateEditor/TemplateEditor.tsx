import { Box, Theme, Typography } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  fetchSnippets,
  fetchTemplates,
  generateSnippets,
  generateTemplates,
  applySnippets
} from 'api/snippetGenerator';
import { SnippetsList, TemplateEditorToolbar, RichTextEditor } from './components';
import { Loading } from 'components';
import { Snippet } from 'models/snippetGenerator';


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
  handwrittenEmails?: Snippet[];
  snippets?: Snippet[];
  templates?: Snippet[];
  selectedItem?: Snippet;
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

  private onListItemSelected = (item: Snippet, type: ItemType) => {
    this.setState({ selectedType: type, selectedItem: item });
  }

  private applyAllSnippets = async () => {
    const { emailAddress } = this.props.match.params;

    const { handwrittenEmails, snippets, templates } = this.state;

    const all: Snippet[] = [...handwrittenEmails || [], ...snippets || [], ...templates || []];


    const result = await applySnippets(emailAddress, all);
    const status = result.result[0].status;

  }

  private onSelectedItemSave = (snippet: Snippet, text: string, trigger: string) => {
    const { selectedType, selectedItem } = this.state;

    if (!selectedType || !selectedItem) {
      return;
    }

    if (selectedType === 'handwrittenEmail' && this.state.handwrittenEmails) {
      const handwrittenEmails = this.state.handwrittenEmails.slice();
      const idx = handwrittenEmails.indexOf(snippet);

      handwrittenEmails[idx].snippet = text;
      handwrittenEmails[idx].trigger = trigger;

      this.setState({ handwrittenEmails });
    } else if (selectedType === 'snippet' && this.state.snippets) {
      const snippets = this.state.snippets.slice();
      const idx = snippets.indexOf(snippet);

      snippets[idx].snippet = text;
      snippets[idx].trigger = trigger;

      this.setState({ snippets });
    } else if (selectedType === 'template' && this.state.templates) {
      const templates = this.state.templates.slice();
      const idx = templates.indexOf(snippet);

      templates[idx].snippet = text;
      templates[idx].trigger = trigger;

      this.setState({ templates });
    }
  }

  private onSelectedItemApply = async (snippet: Snippet, text: string, trigger: string) => {
    const { emailAddress } = this.props.match.params;

    this.onSelectedItemSave(snippet, text, trigger);

    const snippets = [snippet];

    const result = await applySnippets(emailAddress, snippets);
    const status = result.result[0].status;
  }

  private onSelectedItemRemove = (snippet: Snippet) => {
    const { selectedType, handwrittenEmails, snippets, templates } = this.state;

    if (!selectedType) {
      return;
    }

    const text = snippet.snippet;

    if (selectedType === 'handwrittenEmail' && handwrittenEmails) {
      const updatedHandwrittenEmails = handwrittenEmails.slice().filter(s => s.snippet !== text);
      this.setState({ handwrittenEmails: updatedHandwrittenEmails });
    } else if (selectedType === 'snippet' && snippets) {
      const updatedSnippets = snippets.slice().filter(s => s.snippet !== text);
      this.setState({ snippets: updatedSnippets });
    } else if (selectedType === 'template' && templates) {
      const updatedTemplates = templates.slice().filter(s => s.snippet !== text);
      this.setState({ templates: updatedTemplates });
    }
  }

  public render() {
    const { classes } = this.props;
    const { handwrittenEmails, snippets, templates, selectedItem } = this.state;

    if (!handwrittenEmails || !snippets || !templates) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <TemplateEditorToolbar
          onApplyAll={this.applyAllSnippets}
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
            selectedItem={selectedItem}
            onItemSelected={this.onListItemSelected}
          />

          {!selectedItem && (
            <Typography>Select an item from the list first.</Typography>
          )}
          {selectedItem && (
            <RichTextEditor
              snippet={selectedItem}
              onApply={this.onSelectedItemApply}
              onRemove={this.onSelectedItemRemove}
              onSave={this.onSelectedItemSave}
            />
          )}

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
