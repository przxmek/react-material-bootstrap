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
  handwrittenEmails?: string[];
  snippets?: string[];
  templates?: string[];
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

  private onSelectedItemSave = (text: string) => {
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

  private onSelectedItemApply = async (text: string, trigger?: string) => {
    const { emailAddress } = this.props.match.params;

    this.onSelectedItemSave(text);

    trigger = trigger === '' ? undefined : trigger;

    const snippets = [{
      trigger,
      snippet: text,
    }];

    const result = await applySnippets(emailAddress, snippets);
    const status = result.result[0].status;
  }

  private onSelectedItemRemove = () => {
    const { selectedType, selectedItem, handwrittenEmails, snippets, templates } = this.state;

    if (!selectedType || !selectedItem) {
      return;
    }

    if (selectedType === 'handwrittenEmail' && handwrittenEmails) {
      const updatedHandwrittenEmails = handwrittenEmails.slice().filter(s => s !== selectedItem);
      this.setState({ handwrittenEmails: updatedHandwrittenEmails });
    } else if (selectedType === 'snippet' && snippets) {
      const updatedSnippets = snippets.slice().filter(s => s !== selectedItem);
      this.setState({ snippets: updatedSnippets });
    } else if (selectedType === 'template' && templates) {
      const updatedTemplates = templates.slice().filter(s => s !== selectedItem);
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
            <RichTextEditor
              text={selectedItem}
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
