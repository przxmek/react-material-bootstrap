import { Box, Theme, Typography } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  fetchTemplates,
  applySnippets,
  generateTemplates,
  TemplateType
} from 'api/snippetGenerator';
import { SnippetsList, TemplateEditorToolbar, RichTextEditor } from './components';
import { Loading, showAlert } from 'components';
import { Template, TemplatesResponse } from 'models/snippetGenerator';


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
  templates?: Template[];
  templatesWithVars?: Template[];
  potentialTemplates?: Template[];
  potentialTemplatesWithVars?: Template[];
  paragraphSnippets?: Template[];
  selectedItem?: Template;
  selectedType?: TemplateType;
  loaded: boolean;
}

class TemplateEditor extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      templates: undefined,
      templatesWithVars: undefined,
      potentialTemplates: undefined,
      potentialTemplatesWithVars: undefined,
      paragraphSnippets: undefined,
      selectedItem: undefined,
      selectedType: undefined,
      loaded: false
    };
  }

  public componentDidMount = async () => {
    const { emailAddress } = this.props.match.params;

    const response = await fetchTemplates(emailAddress);

    if (response.result === "failure") {
      this.setState({ loaded: true });
      showAlert("error", `Failed to fetch templates: ${response.message}`, 10000);
    }

    this.applyTemplatesResponse(response);
  }

  private generateNewTemplates = async () => {
    const { emailAddress } = this.props.match.params;

    showAlert("info", "Processing...", 5000);

    const response = await generateTemplates(emailAddress);
    if (response.result === 'failure') {
      this.setState({ loaded: true });
      showAlert('error', `Failed to generate templates: ${response.message}`, 10000);
      return;
    }

    this.applyTemplatesResponse(response);

    showAlert("success", "Templates generated", 5000);
  }

  private applyTemplatesResponse = (response: TemplatesResponse) => {
    const {
      templates,
      templates_with_vars: templatesWithVars,
      potential_templates: potentialTemplates,
      potential_templates_with_vars: potentialTemplatesWithVars,
      paragraph_snippets: paragraphSnippets
    } = response;

    this.setState({
      loaded: true,
      templates,
      templatesWithVars,
      potentialTemplates,
      potentialTemplatesWithVars,
      paragraphSnippets
    });
  }


  private onListItemSelected = (item: Template, type: TemplateType) => {
    this.setState({ selectedType: type, selectedItem: item });
  }

  private applyAllSnippets = async () => {
    const { emailAddress } = this.props.match.params;
    const { templates } = this.state;

    const all: Template[] = templates || [];

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

  private onSelectedItemSave = (template: Template, text: string, trigger: string) => {
    const { selectedType, selectedItem } = this.state;

    if (!selectedType || !selectedItem) {
      return;
    }

    if (selectedType === 'paragraph_snippets' && this.state.paragraphSnippets) {
      const paragraphSnippets = this.state.paragraphSnippets.slice();
      const idx = paragraphSnippets.indexOf(template);

      paragraphSnippets[idx].snippet = text;
      paragraphSnippets[idx].trigger = trigger;

      this.setState({ paragraphSnippets });
    } else if (selectedType === 'templates' && this.state.templates) {
      const templates = this.state.templates.slice();
      const idx = templates.indexOf(template);

      templates[idx].snippet = text;
      templates[idx].trigger = trigger;

      this.setState({ templates });
    }
  }

  private onSelectedItemApply = async (snippet: Template, text: string, trigger: string) => {
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

  private onSelectedItemRemove = (snippet: Template) => {
    const {
      selectedType,
      paragraphSnippets,
      templates,
      templatesWithVars,
      potentialTemplates,
      potentialTemplatesWithVars
    } = this.state;

    if (!selectedType) {
      return;
    }

    const trigger = snippet.trigger;

    if (selectedType === 'paragraph_snippets' && paragraphSnippets) {
      this.setState({
        paragraphSnippets: paragraphSnippets.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'templates' && templates) {
      this.setState({
        templates: templates.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'templates_with_vars' && templatesWithVars) {
      this.setState({
        templatesWithVars: templatesWithVars.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'potential_templates' && potentialTemplates) {
      this.setState({
        potentialTemplates: potentialTemplates.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined,
        selectedType: undefined
      });
    } else if (selectedType === 'potential_templates_with_vars' && potentialTemplatesWithVars) {
      this.setState({
        potentialTemplatesWithVars: potentialTemplatesWithVars.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined,
        selectedType: undefined
      });
    }
  }

  public render() {
    const { classes } = this.props;
    const {
      templates,
      templatesWithVars,
      potentialTemplates,
      potentialTemplatesWithVars,
      paragraphSnippets,
      selectedItem,
      loaded
    } = this.state;

    if (!loaded) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <TemplateEditorToolbar
          // onApplyAll={this.applyAllSnippets}
          onGenerateTemplates={this.generateNewTemplates}
        />
        <Box
          display="flex"
          flexDirection="row"
          className={classes.content}
        >
          <SnippetsList
            templates={templates}
            templatesWithVars={templatesWithVars}
            potentialTemplates={potentialTemplates}
            potentialTemplatesWithVars={potentialTemplatesWithVars}
            paragraphSnippets={paragraphSnippets}
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
