import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { Link, useHistory } from "react-router-dom";
import MapIcon from "@material-ui/icons/Map";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import { logout } from "../Firebase/firebase";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function MyAppBar(props) {
  const authenticated = props.authenticated;
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [openAssistant, setOpenAssistant] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      enqueueSnackbar("Logged-out Successfully", { variant: "success" });
      history.push("/");
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  function getRenderMenuItems(authenticated, handleLogout) {
    if (authenticated) {
      return [
        <MenuItem component={Link} to="/profile">
          Profile
        </MenuItem>,
        <MenuItem onClick={handleLogout}>Logout</MenuItem>,
      ];
    } else {
      return [
        <MenuItem component={Link} to="/signup">
          Signup
        </MenuItem>,
        <MenuItem component={Link} to="/signin">
          Signin
        </MenuItem>,
      ];
    }
  }

  function getRenderMobileMenuItems(authenticated, handleProfileMenuOpen) {
    if (authenticated) {
      return [
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>,
        <MenuItem>
          <IconButton
            size="large"
            color="inherit"
            component={Link}
            to="/messaging"
          >
            <Badge color="error">
              <InsertCommentIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>,
        <MenuItem>
          <IconButton
            size="large"
            color="inherit"
            component={Link}
            to="/explore"
          >
            <Badge color="error">
              <MapIcon />
            </Badge>
          </IconButton>
          <p>Explore</p>
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem component={Link} to="/signup">
          Signup
        </MenuItem>,
        <MenuItem component={Link} to="/signin">
          Signin
        </MenuItem>,
      ];
    }
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {getRenderMenuItems(authenticated, handleLogout)}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {getRenderMobileMenuItems(authenticated, handleMobileMenuOpen)}
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {!props.showBackButton && (
              <Button
                style={{ color: "white" }}
                onClick={() => {
                  history.push("/");
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  lineHeight: "24px",
                  letterSpacing: "0.02857em",
                  textTransform: "capitalize",
                  color: "white",
                }}
              >
                <Typography style={{ fontFamily: "Helvetica" }}>
                  Good Citizen
                </Typography>
              </Button>
            )}

            {props.showBackButton && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => history.goBack()}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Ask a question..."
                inputProps={{ "aria-label": "search" }}
                onClick={() => {
                  history.push("/assistant");
                }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {authenticated && (
                <>
                  <IconButton
                    size="large"
                    color="inherit"
                    component={Link}
                    to="/messaging"
                  >
                    <Badge color="error">
                      <InsertCommentIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    color="inherit"
                    component={Link}
                    to="/community-map"
                  >
                    <Badge color="error">
                      <MapIcon />
                    </Badge>
                  </IconButton>
                </>
              )}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}
