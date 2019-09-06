import { Theme, Button, TextField, Grid } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  text: string;
  onApply: (text: string, trigger?: string) => void;
  onRemove: () => void;
  onSave: (text: string) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  text: string;
  trigger?: string;
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
      text: props.text,
      trigger: undefined,
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { text } = this.props;
    if (text !== prevProps.text) {
      this.setState({ text });
    }
  }

  private onTextChange = (text: string) => {
    this.setState({ text });
  }

  private onTriggerChange = (trigger: string) => {
    this.setState({ trigger });
  }

  public render() {
    const { classes, onApply, onRemove, onSave } = this.props;
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
            <Button variant="outlined" onClick={onRemove} disabled>
              <DeleteIcon className={classes.iconLeft} />
              Remove
            </Button>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => onSave(text)}>
              Save edits
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => onApply(text, trigger)}>
              Apply to profile
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(RichTextEditor);
