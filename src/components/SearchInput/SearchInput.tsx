import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Paper, Input, Theme } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const styles = (theme: Theme) => createStyles({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
});

interface Props {
  className?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  style?: any;
}
type PropsType = Props & WithStyles<typeof styles>;

interface State { }

class SearchInput extends React.Component<PropsType, State> {

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!this.props.onChange) {
      return;
    }

    this.props.onChange(event.target.value);
  }

  public render() {
    const { classes, className, onChange, placeholder, style, ...rest } = this.props;

    return (
      <Paper
        {...rest}
        className={clsx(classes.root, className)}
        style={style}
      >
        <SearchIcon className={classes.icon} />
        <Input
          {...rest}
          placeholder={placeholder}
          className={classes.input}
          disableUnderline
          onChange={this.onChange}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SearchInput);
