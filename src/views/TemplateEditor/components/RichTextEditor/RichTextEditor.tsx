import {
  Theme,
  Button,
  TextField,
  Grid,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  Box
} from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import { Template } from 'models/templates';
import ChipsArray from './ChipsArray';
import { reformatText } from 'common/text';

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
    height: '100%'
  },
  editorText: {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1rem',
    paddingBottom: '3rem',
  },
  editorHTML: {
    height: 400,
    marginTop: '1rem',
    marginBottom: '1rem',
    paddingBottom: '3rem',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

interface Props {
  snippet?: Template;
  onApply?: (text: string, trigger: string, labels: string[]) => void;
  onRemove: (snippet: Template) => void;
  onSave: (text: string, trigger: string, labels: string[]) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  htmlEditor: boolean;
  text: string;
  trigger: string;
  labels: string[];
}

class RichTextEditor extends React.Component<PropsType, State> {
  private modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'emoji'],
        ['clean'],
      ]
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    "emoji-toolbar": true,
  };

  private formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'emoji'
  ];

  constructor(props: PropsType) {
    super(props);

    this.state = {
      htmlEditor: true,
      text: props.snippet ? props.snippet.text : "",
      trigger: props.snippet ? props.snippet.trigger : "",
      labels: props.snippet ? props.snippet.labels : []
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { snippet } = this.props;
    if (snippet !== prevProps.snippet) {
      if (snippet) {
        this.setState({
          text: snippet.text,
          trigger: snippet.trigger,
          labels: snippet && (snippet as any).labels ? (snippet as any).labels : undefined
        });
      } else {
        this.setState({ text: "", trigger: "" });
      }
    }
  }

  private onTextChange = (text: string) => {
    this.setState({ text });
  }

  private onTriggerChange = (trigger: string) => {
    this.setState({ trigger });
  }

  private onDeleteLabel = (label: string) => {
    if (!this.state.labels) {
      return;
    }

    const labels = this.state.labels.filter(l => l !== label);
    this.setState({ labels });
  }

  private onSaveNewLabel = (label: string) => {
    if (!this.state.labels) {
      return;
    }

    const labels = this.state.labels.slice();
    labels.push(label);

    this.setState({ labels });
  }

  private onSave = () => {
    const { onSave } = this.props;
    const { text, trigger, labels } = this.state;

    const formatted = reformatText(text);

    onSave(formatted, trigger, labels);
  }

  private onApply = () => {
    const { onApply } = this.props;
    const { text, trigger, labels } = this.state;

    if (!onApply) {
      return;
    }

    const formatted = reformatText(text);

    onApply(formatted, trigger, labels);
  }

  public render() {
    const { classes, onRemove, onApply, snippet } = this.props;
    const { text, trigger, labels, htmlEditor } = this.state;

    return (
      <Box
        display="flex"
        flexDirection="column"
        className={classes.root}
      >

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

        {labels && (<>
          <ChipsArray
            data={labels}
            handleDelete={this.onDeleteLabel}
            handleSaveNewLabel={this.onSaveNewLabel}
          />
        </>
        )}

        <FormControlLabel
          label="HTML Editor"
          control={
            <Checkbox
              checked={htmlEditor}
              onChange={() => this.setState({ htmlEditor: !htmlEditor })}
              inputProps={{
                'aria-label': 'HTML Editor toggle checkbox',
              }}
            />
          }
        />

        {!htmlEditor && (
          <TextareaAutosize
            className={classes.editorText}
            rows={20}
            rowsMax={40}
            placeholder="Snippet text.."
            value={text}
            onChange={(ev) => { this.onTextChange(ev.target.value); }}
          />
        )}

        {htmlEditor && (
          <ReactQuill
            value={text}
            onChange={this.onTextChange}
            modules={this.modules}
            formats={this.formats}
            className={classes.editorHTML}
          />
        )}

        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              disabled={!snippet}
              onClick={() => snippet && onRemove(snippet)}
            >
              <DeleteIcon className={classes.iconLeft} />
              Remove
            </Button>
          </Grid>
          <Grid item xs></Grid>
          {onApply && (
            <Grid item>
              <Button variant="outlined" onClick={() => this.onApply()}>
                Apply to profile
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.onSave()}
            >
              Save edits
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default withStyles(styles)(RichTextEditor);
