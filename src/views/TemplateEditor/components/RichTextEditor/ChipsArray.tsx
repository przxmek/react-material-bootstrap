import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import { showAlert } from 'components';
import clsx from 'clsx';

type ChipData = string;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      // justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(1),
      margin: theme.spacing(1, 0),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    newLabel: {
      width: theme.spacing(16),
    }
  }),
);

interface Props {
  data: ChipData[];
  handleDelete: (text: string) => void;
  handleSaveNewLabel: (text: string) => void;
}

export const ChipsArray: React.SFC<Props> = (props) => {
  const classes = useStyles();
  const { data, handleDelete, handleSaveNewLabel } = props;

  const [newLabel, setNewLabel] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    if (e.target.value.includes(' ')) {
      showAlert("warning", "Label cannot contain spaces 😪");
    } else {
      setNewLabel(newValue);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (data.includes(newLabel)) {
        showAlert("warning", `Label '${newLabel}' already exists.`);
        return;
      }
      handleSaveNewLabel(newLabel);
      setNewLabel('');
    }
  }

  function handleBlur() {
    setNewLabel('');
  }

  return (
    <Paper className={classes.root}>
      {data.map(text => {
        return (
          <Chip
            size={"small"}
            key={text}
            label={text}
            onDelete={() => handleDelete(text)}
            className={classes.chip}
          />
        );
      })}
      <Chip
        size={"small"}
        key="new-label"
        component={TextField}
        placeholder="Add a new label"
        variant="outlined"
        className={clsx(classes.chip, classes.newLabel)}
        value={newLabel}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onBlur={handleBlur}
      />
    </Paper>
  );
};

export default ChipsArray;