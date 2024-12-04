import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AppsIcon from '@material-ui/icons/Apps';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'

import Blockie from '../components/Blockie';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 1
  }
}));
    
export default function AccountDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container = window !== undefined ? () => window().document.body : undefined;
  const currentPrincipal = useSelector(state => state.currentPrincipal)
  const accounts = useSelector(state => (state.principals.length ? state.principals[currentPrincipal].accounts : []))
  const idtype = useSelector(state => (state.principals.length ? state.principals[currentPrincipal].identity.type : ""));
  const principal = useSelector(state => (state.principals.length ? state.principals[currentPrincipal].identity.principal : ""));
  const dispatch = useDispatch()
  
  const addAccount = () => {
    var nextid = accounts.length;
    dispatch({ type: 'account/add', payload : {id : nextid, principal : principal}});
    props.changeRoute('accountDetail', nextid);
  };
  
  const accountsList = (
    <div style={{marginTop:64, marginBottom: 100}}>
      <div style={{width:drawerWidth-1, zIndex: 10, backgroundColor:'white', position:"fixed", top:0, textAlign:"center"}} className={classes.toolbar}>
        {/*<span style={{display:'block', fontSize:'x-large',padding:'15px 0', textAlign:'center',fontWeight:'bold'}}>Stoic Wallet <span style={{fontSize:'small',fontWeight:'normal'}}>By Toniq Labs</span></span>*/}
        <img style={{maxHeight:'50px',marginTop:'5px'}} alt="Stoic Wallet by Toniq Labs" src="logo.png" />
      </div>
      <Divider />
      <List>
        {accounts.map((account, index) => {
          return (
            <div key={index}>
              <ListItem button onClick={() => {props.onClose(); props.changeRoute('accountDetail', index)}}>
                <ListItemAvatar>
                  <Avatar>
                    <Blockie address={account.address} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={account.name}
                  secondary={account.address} />
              </ListItem>
            </div>
          )
        })}
        <ListItem button onClick={addAccount}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add Account" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => {props.onClose(); props.changeRoute('addressBook')}}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Address Book" />
        </ListItem>
        <ListItem button onClick={() => {props.onClose(); props.changeRoute('neurons')}}>
          <ListItemIcon><AllInclusiveIcon /></ListItemIcon>
          <ListItemText primary="Neurons" />
        </ListItem>
        <ListItem button onClick={() => {props.onClose(); props.changeRoute('applications')}}>
          <ListItemIcon><AppsIcon /></ListItemIcon>
          <ListItemText primary="Applications" />
        </ListItem>
        {idtype === 'watch' ? "" :
        <ListItem button onClick={() => {props.onClose(); props.lockWallet()}}>
          <ListItemIcon><LockIcon /></ListItemIcon>
          <ListItemText primary="Lock Wallet" />
        </ListItem> }
      </List>
      <div style={{width: drawerWidth-1, zIndex: 10, backgroundColor:'white', position:"fixed", bottom:0, textAlign:'center'}} className={classes.toolbar}>
        <span style={{position:'absolute', bottom:'10px', left:'0', right:'0'}}>Having issues? -> support@toniqlabs.com</span>
      </div>
    </div>
  );
  
  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.open}
          onClose={props.onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {accountsList}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {accountsList}
        </Drawer>
      </Hidden>
    </nav>
  );
}
