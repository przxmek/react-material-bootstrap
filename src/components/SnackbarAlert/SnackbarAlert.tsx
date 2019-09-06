import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from "@material-ui/core/styles";
import { render, unmountComponentAtNode } from "react-dom";
import { ExitHandler } from "react-transition-group/Transition";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = (theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: theme.palette.primary.dark
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing()
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  });

type AlertVariant = "success" | "warning" | "error" | "info";

interface Props extends WithStyles<typeof styles> {
  className?: string;
  message: React.ReactNode;
  variant: "success" | "warning" | "error" | "info";
  onClose: ExitHandler;
  autoHideDuration: number;
}
interface State {
  open: boolean;
}

class SnackbarAlert extends React.Component<Props, State> {
  public state = {
    open: true
  };

  private close = () => {
    this.setState({ open: false });
  }

  public render() {
    const {
      classes,
      className,
      message,
      variant,
      autoHideDuration,
      onClose,
      ...other
    } = this.props;
    const Icon = variantIcon[variant];

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={this.state.open}
        autoHideDuration={autoHideDuration}
        onClose={this.close}
        onExited={onClose}
      >
        <SnackbarContent
          className={classes[variant] + " " + className}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classes.icon + " " + classes.iconVariant} />
              {message}
            </span>
          }
          {...other}
        />
      </Snackbar>
    );
  }
}

export const Alert = withStyles(styles)(SnackbarAlert);

export function showAlert(
  variant: AlertVariant,
  message: React.ReactNode,
  autoHideDuration = 1600,
  props = {}
) {
  const mount = document.createElement("div");
  document.body.appendChild(mount);
  const onClose = () => {
    unmountComponentAtNode(mount);
    mount.remove();
  };
  render(
    <Alert
      variant={variant}
      message={message}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      {...props}
    />,
    mount
  );
}
export default showAlert;
