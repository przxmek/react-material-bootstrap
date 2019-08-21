export default interface User {
  id: string;
  email_address: string;

  // Meta information
  create_date: string;
  modify_date: string;
  last_login: string;

  // Account status & subscription
  active: boolean;
  active_until: string;
  membership_type: 'free' | 'premium';
  will_renew: boolean;

  // User preferences
  search_type: 'standard' | 'keyword' | 'hybrid';
  tab_completion: boolean;
  facebook_dropdown: boolean;
  zendesk_dropdown: boolean;
  front_dropdown: boolean;
  slack_dropdown: boolean;
  close_dropdown: boolean;
  menu_everywhere: boolean;
}