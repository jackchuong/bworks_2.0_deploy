import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import DeselectIcon from "@mui/icons-material/Deselect";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import ConstructionIcon from "@mui/icons-material/Construction";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  useSidebarState,
} from "react-admin";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import SubMenu from "./SubMenu";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import Divider from "@mui/material/Divider";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import InputOutlinedIcon from "@mui/icons-material/InputOutlined";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import { useMediaQuery, Theme, useTheme } from "@mui/material";

type MenuName =
  | "postJobs"
  | "manageFund"
  | "reports"
  | "settings"
  | "tools"
  | "Help"
  | "jobSeeker";

const Menu = ({ dense = false }: MenuProps) => {
  //large screen or smaller open only 3 menus
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const maxOpenMenus = matches ? 3 : 4;

  const [state, setState] = useState({
    postJobs: true,
    jobSeeker: true,
    manageFund: true,
    reports: true,
    settings: false,
    tools: false,
  });
  const translate = useTranslate();
  const [open] = useSidebarState();

  const handleToggle = (menu: MenuName) => {
    const menus = Object.keys(state).map((key) => ({
      menu: key,
      status: state[key],
    }));

    if (menus.filter((menu) => menu.status === true).length === maxOpenMenus) {
      const closeMenu = menus.find((i) => i.status === true).menu;
      setState({ ...state, [menu]: !state[menu], [closeMenu]: false });
      return;
    }
    setState({ ...state, [menu]: !state[menu] });
  };

  return (
    <Box
      sx={{
        width: open ? 250 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <DashboardMenuItem sx={{ textTransform: "uppercase" }} />
      <Divider />
      <SubMenu
        handleToggle={() => handleToggle("postJobs")}
        isOpen={state.postJobs}
        name="pos.menu.postJobs"
        icon={<WorkHistoryOutlinedIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/postjobs"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.postJobs.name`, {
            smart_count: 2,
          })}
          leftIcon={<FactCheckOutlinedIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/jobbids"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.jobBids.name`, {
            smart_count: 2,
          })}
          leftIcon={<PlagiarismOutlinedIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("jobSeeker")}
        isOpen={state.jobSeeker}
        name="pos.menu.jobSeeker"
        icon={<ManageSearchOutlinedIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/postjobsjsk"
          /*  
        //to reset search filter when click menu item
         to={{
            pathname: "/postjobsjsk",
            search: `filter=${JSON.stringify({})}`,
          }} */
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.postJobsJsk.name`, {
            smart_count: 2,
          })}
          leftIcon={<FormatListNumberedOutlinedIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/jobbidsjsk"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.jobBidsJsk.name`, {
            smart_count: 2,
          })}
          leftIcon={<InputOutlinedIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("manageFund")}
        isOpen={state.manageFund}
        name="pos.menu.manageFund"
        icon={<AttachMoneyIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/plutustxs"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.contractedJobs.name`, {
            smart_count: 2,
          })}
          leftIcon={<QrCodeOutlinedIcon />}
          dense={dense}
        />

        <MenuItemLink
          to="/smartcontract"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.smartContracts.name`, {
            smart_count: 2,
          })}
          leftIcon={<FormatListBulletedIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("reports")}
        isOpen={state.reports}
        name="pos.menu.reports"
        icon={<FileCopyOutlinedIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/postedjobreport"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.postJobReports.name`, {
            smart_count: 2,
          })}
          leftIcon={<NotesIcon />}
          dense={dense}
        />

        <MenuItemLink
          to="/paymentreport"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.paymentReport.name`, {
            smart_count: 2,
          })}
          leftIcon={<AttachMoneyIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/postedjobreportjsk"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.postJobReportsJsk.name`, {
            smart_count: 2,
          })}
          leftIcon={<NotesIcon />}
          dense={dense}
        />

        <MenuItemLink
          to="/paymentreportjsk"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.paymentReportJsk.name`, {
            smart_count: 2,
          })}
          leftIcon={<AttachMoneyIcon />}
          dense={dense}
        />
      </SubMenu>

      <MenuItemLink
        to="/jobtasks"
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.jobtasks.name`, {
          smart_count: 2,
        })}
        leftIcon={<ListAltOutlinedIcon />}
        dense={dense}
      />

      <SubMenu
        handleToggle={() => handleToggle("tools")}
        isOpen={state.tools}
        name="pos.menu.tools"
        icon={<DeselectIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/fetchCardano"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.cardanos.name`, {
            smart_count: 2,
          })}
          leftIcon={<NotesIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/parseAddress"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.parseAddress.name`, {
            smart_count: 2,
          })}
          leftIcon={<DriveFileRenameOutlineOutlinedIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/fetchGithub"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.gits.name`, {
            smart_count: 2,
          })}
          leftIcon={<BlurOnIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("settings")}
        isOpen={state.settings}
        name="pos.menu.settings"
        icon={<ConstructionIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/wallets"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.wallets.name`, {
            smart_count: 2,
          })}
          leftIcon={<AccountBalanceWalletOutlinedIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/userSettings"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.userSettings.name`, {
            smart_count: 2,
          })}
          leftIcon={<PeopleOutlinedIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/changePassword"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.changePassword.name`, {
            smart_count: 2,
          })}
          leftIcon={<PasswordOutlinedIcon />}
          dense={dense}
        />
      </SubMenu>
      <MenuItemLink
        to="/help"
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.help.name`, {
          smart_count: 2,
        })}
        leftIcon={<HelpCenterOutlinedIcon />}
        dense={dense}
      />
    </Box>
  );
};

export default Menu;
