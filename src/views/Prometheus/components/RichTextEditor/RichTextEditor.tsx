import { Theme, Button, TextField, Grid } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PrometheusSnippet } from 'models/prometheus';

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.common.white,
    height: '100%',
    padding: theme.spacing(2),
  },
  editor: {
    height: 600,
    marginTop: 16,
    paddingBottom: 48,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

interface Props {
  snippet: PrometheusSnippet;
  onApply: (snippet: PrometheusSnippet, newText: string, newTrigger: string) => void;
  onRemove: (snippet: PrometheusSnippet) => void;
  onSave: (snippet: PrometheusSnippet, newText: string, newTrigger: string) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  text: string;
  trigger: string;
}

class RichTextEditor extends React.Component<PropsType, State> {
  private modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  };

  private formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  constructor(props: PropsType) {
    super(props);

    this.state = {
      text: props.snippet.text,
      trigger: props.snippet.trigger,
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { snippet } = this.props;
    if (snippet !== prevProps.snippet) {
      this.setState({ text: snippet.text, trigger: snippet.trigger });
    }
  }

  private onTextChange = (text: string) => {
    this.setState({ text });
  }

  private onTriggerChange = (trigger: string) => {
    this.setState({ trigger });
  }

  public render() {
    const { classes, onApply, onRemove, onSave, snippet } = this.props;
    const { text, trigger } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          label="Trigger"
          helperText="A trigger for this snippet."
          margin="normal"
          variant="outlined"
          value={trigger}
          onChange={e => this.onTriggerChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <ReactQuill.default
          value={text}
          onChange={this.onTextChange}
          modules={this.modules}
          formats={this.formats}
          className={classes.editor}
        />
        <Grid container spacing={1}>
          <Grid item>
            <Button variant="outlined" onClick={() => onRemove(snippet)}>
              <DeleteIcon className={classes.iconLeft} />
              Remove
            </Button>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => onApply(snippet, text, trigger)}>
              Apply to profile
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => onSave(snippet, text, trigger)}>
              Save edits
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(RichTextEditor);
