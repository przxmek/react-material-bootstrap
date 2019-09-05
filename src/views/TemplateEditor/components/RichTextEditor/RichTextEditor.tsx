import { Theme, Button, TextField } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  editor: {
    height: 600,
    marginTop: 16,
    paddingBottom: 48,
  }
});

interface Props {
  text: string;
  onTextChange: (text: string) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  text: string;
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

  private onSave = () => {
    const { onTextChange } = this.props;
    const { text } = this.state;

    onTextChange(text);
  }

  public render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          label="Trigger"
          helperText="A trigger for this snippet."
          margin="normal"
          variant="outlined"
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
        <Button variant="contained" color="primary" onClick={this.onSave}>
          Save
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(RichTextEditor);
