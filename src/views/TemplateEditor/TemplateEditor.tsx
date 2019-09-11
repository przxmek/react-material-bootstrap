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
import { Loading, showAlert } from 'components';
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
    const snippetsResponse = await fetchSnippets(emailAddress);
    const snippets = snippetsResponse.snippets ? snippetsResponse.snippets : [];

    if (templatesResponse.result === "failure") {
      showAlert("error", `Failed to fetch templates: ${templatesResponse.message}`, 10000);
    }
    if (snippetsResponse.result === "failure") {
      showAlert("error", `Failed to fetch snippets: ${snippetsResponse.message}`, 10000);
    }

    this.setState({ handwrittenEmails, templates, snippets });
  }

  private generateNewTemplates = async () => {
    const { emailAddress } = this.props.match.params;

    showAlert("info", "Processing...", 5000);

    const templatesResponse = await generateTemplates(emailAddress);
    const templates = templatesResponse.templates;
    const handwrittenEmails = templatesResponse.handwritten_emails;
    this.setState({ handwrittenEmails, templates });

    showAlert("success", "Templates generated", 5000);
  }

  private generateNewSnippets = async () => {
    const { emailAddress } = this.props.match.params;

    showAlert("info", "Processing...", 5000);

    const snippetsResponse = await generateSnippets(emailAddress);
    const snippets = snippetsResponse.snippets ? snippetsResponse.snippets : [];
    this.setState({ snippets });

    showAlert("success", "Snippets generated", 5000);
  }

  private onListItemSelected = (item: Snippet, type: ItemType) => {
    this.setState({ selectedType: type, selectedItem: item });
  }

  private applyAllSnippets = async () => {
    const { emailAddress } = this.props.match.params;

    const { handwrittenEmails, snippets, templates } = this.state;

    const all: Snippet[] = [...handwrittenEmails || [], ...snippets || [], ...templates || []];

    showAlert("info", "Processing...", 5000);

    const result = await applySnippets(emailAddress, all);
    const statusList = result.result.map(i => i.status);
    const failed = statusList.filter(s => s !== 'added');


    if (failed.length === 0) {
      showAlert(
        "success",
        `${statusList.length} snippets added to Prometheus profile`,
        5000
      );
    } else {
      showAlert(
        "error",
        `${failed.length} snippets couldn't be saved: ${JSON.stringify(result)}`,
        30000
      );
    }
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

    showAlert("info", "Processing...", 5000);

    const result = await applySnippets(emailAddress, snippets);
    const status = result.result[0].status;

    if (status === 'added') {
      showAlert("success", "Snippet added to Prometheus profile", 5000);
    } else {
      showAlert("error", `Something went wrong: ${status}`, 30000);
    }
  }

  private onSelectedItemRemove = (snippet: Snippet) => {
    const { selectedType, handwrittenEmails, snippets, templates } = this.state;

    if (!selectedType) {
      return;
    }

    const trigger = snippet.trigger;

    if (selectedType === 'handwrittenEmail' && handwrittenEmails) {
      const updatedHandwrittenEmails = handwrittenEmails.slice().filter(s => s.trigger !== trigger);
      this.setState({
        handwrittenEmails: updatedHandwrittenEmails,
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'snippet' && snippets) {
      const updatedSnippets = snippets.slice().filter(s => s.trigger !== trigger);
      this.setState({
        snippets: updatedSnippets,
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'template' && templates) {
      const updatedTemplates = templates.slice().filter(s => s.trigger !== trigger);
      this.setState({
        templates: updatedTemplates,
        selectedItem: undefined,
        selectedType: undefined
      });
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
