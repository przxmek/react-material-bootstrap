import { Box, Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  fetchTemplates,
  applySnippets,
  generateTemplates
} from 'api/snippetGenerator';
import { SnippetsList, TemplateEditorToolbar, RichTextEditor } from './components';
import { Loading, showAlert } from 'components';
import { TemplatesResponse } from 'models/snippetGenerator';
import { Template, PrometheusTemplate } from 'models/templates';
import { fetchSnippets } from 'api/prometheus';


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

  prometheusSnippets?: PrometheusTemplate[];

  selectedItem?: Template;

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
      
      prometheusSnippets: undefined,

      selectedItem: undefined,

      loaded: false
    };
  }

  public componentDidMount = async () => {
    const { emailAddress } = this.props.match.params;

    this.loadSnippetGeneratorData(emailAddress);
    this.loadPrometheusData(emailAddress);
  }

  private loadSnippetGeneratorData = async (emailAddress: string) => {
    const response = await fetchTemplates(emailAddress);

    if (response.status === "failure") {
      this.setState({ loaded: true });
      showAlert("error", `Failed to fetch templates: ${response.message}`, 10000);
    }

    this.applyTemplatesResponse(response);
  }

  private loadPrometheusData = async (emailAddress: string) => {
    const response = await fetchSnippets(emailAddress);
    const prometheusSnippets = [...response.custom, ...response.generated];

    this.setState({ prometheusSnippets });
  }

  private generateNewTemplates = async () => {
    const { emailAddress } = this.props.match.params;

    showAlert("info", "Processing...", 5000);

    const response = await generateTemplates(emailAddress);

    if (response.status === 'failure') {
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


  private onListItemSelected = (item: Template) => {
    this.setState({ selectedItem: item });
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

  private onSelectedItemSave = (newText: string, newTrigger: string, template?: Template) => {
    const { selectedItem } = this.state;


    if (!selectedItem && !template) {
      // TODO save new custom template
      return;
    }
    
    if (!selectedItem || !template) {
      return;
    }

    const selectedType = selectedItem.type;

    if (selectedType === "paragraphSnippet" && this.state.paragraphSnippets) {
      const paragraphSnippets = this.state.paragraphSnippets.slice();
      const idx = paragraphSnippets.indexOf(template);

      paragraphSnippets[idx].text = newText;
      paragraphSnippets[idx].trigger = newTrigger;

      this.setState({ paragraphSnippets });
    } else if (selectedType === "template" && this.state.templates) {
      const templates = this.state.templates.slice();
      const idx = templates.indexOf(template);

      templates[idx].text = newText;
      templates[idx].trigger = newTrigger;

      this.setState({ templates });
    } else if (selectedType === "templateWithVars" && this.state.templatesWithVars) {
      const templatesWithVars = this.state.templatesWithVars.slice();
      const idx = templatesWithVars.indexOf(template);

      templatesWithVars[idx].text = newText;
      templatesWithVars[idx].trigger = newTrigger;

      this.setState({ templatesWithVars });
    } else if (selectedType === "potentialTemplate" && this.state.potentialTemplates) {
      const potentialTemplates = this.state.potentialTemplates.slice();
      const idx = potentialTemplates.indexOf(template);

      potentialTemplates[idx].text = newText;
      potentialTemplates[idx].trigger = newTrigger;

      this.setState({ potentialTemplates });
    } else if (selectedType === "potentialTemplateWithVars" && this.state.potentialTemplatesWithVars) {
      const potentialTemplatesWithVars = this.state.potentialTemplatesWithVars.slice();
      const idx = potentialTemplatesWithVars.indexOf(template);

      potentialTemplatesWithVars[idx].text = newText;
      potentialTemplatesWithVars[idx].trigger = newTrigger;

      this.setState({ potentialTemplatesWithVars });
    }
  }

  private onSelectedItemApply = async (text: string, trigger: string, snippet?: Template) => {
    const { emailAddress } = this.props.match.params;

    if (snippet) {
      this.onSelectedItemSave(text, trigger, snippet);
    }

    const snippets = snippet ? [snippet] : [{ trigger, text }];

    showAlert("info", "Processing...", 5000);

    const response = await applySnippets(emailAddress, snippets);
    if (response.status === 'failure') {
      showAlert("error", `Failed to apply snippet: ${response.message}`, 30000);
    } else {
      const status = response.result[0].status;
      if (status === 'added') {
        showAlert("success", "Snippet added to Prometheus profile", 5000);
      } else {
        showAlert("error", `Failed to apply snippet: ${status}`, 30000);
      }
    }
  }

  private onSelectedItemRemove = (snippet: Template) => {
    const {
      selectedItem,
      paragraphSnippets,
      templates,
      templatesWithVars,
      potentialTemplates,
      potentialTemplatesWithVars
    } = this.state;

    if (!selectedItem) {
      return;
    }

    const selectedType = selectedItem.type;
    const trigger = snippet.trigger;

    if (selectedType === 'paragraphSnippet' && paragraphSnippets) {
      this.setState({
        paragraphSnippets: paragraphSnippets.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
    } else if (selectedType === 'template' && templates) {
      this.setState({
        templates: templates.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
    } else if (selectedType === 'templateWithVars' && templatesWithVars) {
      this.setState({
        templatesWithVars: templatesWithVars.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
    } else if (selectedType === 'potentialTemplate' && potentialTemplates) {
      this.setState({
        potentialTemplates: potentialTemplates.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
    } else if (selectedType === 'potentialTemplateWithVars' && potentialTemplatesWithVars) {
      this.setState({
        potentialTemplatesWithVars: potentialTemplatesWithVars.slice().filter(s => s.trigger !== trigger),
        selectedItem: undefined
      });
    }
  }

  public render() {
    const { emailAddress } = this.props.match.params;
    const { classes } = this.props;
    const {
      templates,
      templatesWithVars,
      potentialTemplates,
      potentialTemplatesWithVars,
      paragraphSnippets,
      prometheusSnippets,
      selectedItem,
      loaded
    } = this.state;

    if (!loaded) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <TemplateEditorToolbar
          emailAddress={emailAddress}
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
            prometheusSnippets={prometheusSnippets}
            selectedItem={selectedItem}
            onItemSelected={this.onListItemSelected}
          />

          <Box flexGrow={1} className={classes.rightContent}>
            <RichTextEditor
              snippet={selectedItem}
              onApply={this.onSelectedItemApply}
              onRemove={this.onSelectedItemRemove}
              onSave={this.onSelectedItemSave}
            />
          </Box>

        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
