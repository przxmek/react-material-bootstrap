import React, { ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Theme,
  Button,
  Link,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import CreditCardIcon from '@material-ui/icons/CreditCard';


import User from 'models/user';
import { RouteComponentProps, withRouter } from 'react-router';
import Contact from 'models/mailjet/contact';
import { changeContactStage } from 'api/mailjet';

const styles = (theme: Theme) => createStyles({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  tableRow: {},
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  buttonMargin: {
    margin: theme.spacing(0.5)
  },
  marginRight: {
    marginRight: theme.spacing(1)
  },
  margin: {
    margin: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
});

interface Props {
  className?: string;
  contacts: Contact[];
  onChangeSelectedUsers: (users: string[]) => void;
  onMailjetUpdate: () => void;
  onUserActivate: (user: User) => void;
  searchText: string;
  users: User[];
}
type PropsType = Props & WithStyles<typeof styles> & RouteComponentProps;

interface State {
  filteredUsers: User[];
  page: number;
  rowsPerPage: number;
  filterText: string;
  selectedUsers: string[];
}

class UsersTable extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      filteredUsers: props.users.slice(),
      page: 0,
      rowsPerPage: 10,
      filterText: '',
      selectedUsers: [],
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { searchText, users } = this.props;

    if (prevProps.searchText !== searchText || prevProps.users !== users) {
      this.onSearchTextChange(searchText);
    }
  }

  private openInNewTab(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private onSearchTextChange = (searchText: string) => {
    const { users } = this.props;
    const filteredUsers = this.filterUsers(searchText, users);
    this.setState({ filteredUsers, selectedUsers: [], page: 0 });
  }

  private visibleUsers = (): User[] => {
    const { filteredUsers, rowsPerPage, page } = this.state;

    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  private filterUsers = (filterText: string, users: User[]): User[] => {
    if (filterText.trim() === '') {
      return users.slice();
    }

    const filterTextLower = filterText.trim().toLowerCase();

    const a = users.filter(u => u.email_address.toLowerCase().startsWith(filterTextLower));
    const b = users.filter(u => u.email_address.toLowerCase().includes(filterTextLower));
    const c = "active".startsWith(filterTextLower) ? users.filter(u => u.active) : [];
    const d = "inactive".startsWith(filterTextLower) ? users.filter(u => !u.active) : [];

    const results = a.concat(b, c, d);
    const deduplicated = results.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

    return deduplicated;
  }

  private setSelectedUsers = (selectedUsers: string[]) => {
    this.setState({ selectedUsers });
    this.props.onChangeSelectedUsers(selectedUsers);
  }

  private setRowsPerPage = (rowsPerPage: number) => {
    this.setState({ rowsPerPage });
  }

  private setPage = (page: number) => {
    this.setState({ page });
  }

  private handleSelectAll = (event: ChangeEvent, checked: boolean) => {
    let selectedUsers: string[];

    if (checked) {
      const visibleUsers = this.visibleUsers();
      selectedUsers = visibleUsers.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    this.setSelectedUsers(selectedUsers);
  }

  private handleSelectOne = (event: ChangeEvent<HTMLElement>, id: string) => {
    const { selectedUsers } = this.state;

    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers: string[] = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setSelectedUsers(newSelectedUsers);
  }

  private handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
    this.setPage(pageNumber);
  }

  private handleRowsPerPageChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setRowsPerPage(parseInt(event.target.value, 10));
    this.setPage(0);
  }

  private getContact = (emailAddress: string): Contact | undefined => {
    const { contacts } = this.props;
    const filtered = contacts.filter(c => c.Email === emailAddress);
    if (filtered.length > 0) {
      return filtered[0];
    } else {
      return undefined;
    }
  }

  private getContactStage = (contact: Contact): string | undefined => {
    const filtered = contact.Properties.filter(p => p.Name === 'stage');
    if (filtered.length > 0) {
      return filtered[0].Value;
    } else {
      return undefined;
    }
  }

  private changeMailjetStage = async (emailAddress: string, stage: string) => {
    const { onMailjetUpdate } = this.props;

    await changeContactStage(emailAddress, stage);

    onMailjetUpdate();
  }

  /**
   * Stages:
   * - new_signup
   * - onboarding
   * - delay_onboarding 
   * - no_survey_results 
   * - scheduling_onboarding
   * - onboarding_scheduled
   * - no_scheduled_meeting
   * 
   * Transitions:
   * - new_signup -> onboarding; delay_onboarding
   * - onboarding -> delay_onboarding; no_survey_results; scheduling_onboarding
   * - delay_onboarding -> onboarding
   * - no_survey_results -> X
   * - scheduling_onboarding -> onboarding_scheduled; no_scheduled_meeting
   * - onboarding_scheduled -> X
   * - no_scheduled_meeting -> X
   */
  private renderMailjetStageButtons(emailAddress: string) {
    const { classes } = this.props;

    const transitions = {
      new_signup: ['onboarding', 'delay_onboarding'],
      onboarding: ['delay_onboarding', 'no_survey_results', 'scheduling_onboarding'],
      delay_onboarding: ['onboarding'],
      no_survey_results: [],
      scheduling_onboarding: ['onboarding_scheduled', 'no_scheduled_meeting'],
      onboarding_scheduled: [],
      no_scheduled_meeting: [],
    };

    const contact = this.getContact(emailAddress);
    if (!contact) {
      return (
        <Button disabled variant="text" size="small">
          Missing Mailjet Contact
        </Button>
      );
    }

    const contactStage = this.getContactStage(contact);
    if (!contactStage) {
      return (
        <Button disabled variant="text" size="small">
          Mailjet contact missing 'stage' property
        </Button>
      );
    }

    if (!(contactStage in transitions)) {
      return (
        <Button disabled variant="text" size="small">
          Unknown Mailjet stage: {contactStage}
        </Button>
      );
    }

    const stages = (transitions as any)[contactStage] as string[];
    return stages.map(stage => (
      <Button
        color="secondary"
        variant="outlined"
        size="small"
        className={classes.buttonMargin}
        onClick={() => this.changeMailjetStage(emailAddress, stage)}
      >
        {stage}
      </Button>
    ));
  }

  private renderTableRow(user: User) {
    const { classes } = this.props;
    const { selectedUsers } = this.state;

    const contact = this.getContact(user.email_address);
    const stage = contact ? this.getContactStage(contact) : '--';

    return (
      <TableRow
        className={classes.tableRow}
        hover
        key={user.id}
        selected={selectedUsers.indexOf(user.id) !== -1}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedUsers.indexOf(user.id) !== -1}
            color="primary"
            onChange={event => this.handleSelectOne(event, user.id)}
            value="true"
          />
        </TableCell>
        <TableCell>
          <RouterLink to={`/account/${user.email_address}`}>
            <Link>{user.email_address}</Link>
          </RouterLink>
        </TableCell>
        <TableCell>
          {moment(user.create_date).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell>
          {stage}
        </TableCell>
        <TableCell>
          {this.renderMailjetStageButtons(user.email_address)}
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            className={classes.buttonMargin}
            href={"https://dashboard.stripe.com/search?query=" + user.email_address}
          >
            <CreditCardIcon className={clsx(classes.marginRight, classes.iconSmall)} />
            Stripe
          </Button>

          <Button
            variant="outlined"
            size="small"
            className={classes.buttonMargin}
            component={RouterLink}
            to={`template-editor/${user.email_address}`}
          >
            <CreateIcon className={clsx(classes.marginRight, classes.iconSmall)} />
            Template editor
          </Button>
        </TableCell>
        <TableCell>
          <Button
            disabled={user.active}
            color="primary"
            variant="outlined"
            size="small"
            className={classes.buttonMargin}
          >
            {user.active ? "Activated" : "Activate"}
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  public render() {
    const { className, classes, onUserActivate, ...rest } = this.props;
    const { filteredUsers, page, rowsPerPage, selectedUsers } = this.state;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.length === this.visibleUsers().length}
                        color="primary"
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length < this.visibleUsers().length
                        }
                        onChange={this.handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Registration date</TableCell>
                    <TableCell>Mailjet Stage</TableCell>
                    <TableCell>Change stage</TableCell>
                    <TableCell>Manage</TableCell>
                    <TableCell>Activation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.visibleUsers().map(user => this.renderTableRow(user))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </CardActions>
      </Card>
    );
  }
}

export default withRouter(withStyles(styles)(UsersTable));
