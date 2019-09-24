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
  onApply: (newText: string, newTrigger: string, snippet?: Template) => void;
  onRemove: (snippet: Template) => void;
  onSave: (newText: string, newTrigger: string, snippet?: Template) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  htmlEditor: boolean;
  text: string;
  trigger: string;
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
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { snippet } = this.props;
    if (snippet !== prevProps.snippet) {
      if (snippet) {
        this.setState({ text: snippet.text, trigger: snippet.trigger });
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

  public render() {
    const { classes, onApply, onRemove, onSave, snippet } = this.props;
    const { text, trigger, htmlEditor } = this.state;

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
          <Grid item>
            <Button variant="outlined" onClick={() => onApply(text, trigger, snippet)}>
              Apply to profile
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => snippet && onSave(text, trigger, snippet)}
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
