import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { MdLocalPolice } from "react-icons/md";
import { MdAnnouncement } from "react-icons/md";
import { MdInfo } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 300,
  },
}));

const NoticeDescription = (props) => {
  const classes = useStyles();

  const options = [
    {
      value: "general",
      label: "General Announcement",
      icon: <MdAnnouncement />,
    },
    { value: "safety", label: "Safety Incident", icon: <MdLocalPolice /> },
    { value: "information", label: "Information ", icon: <MdInfo /> },
  ];

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel>Incident Type</InputLabel>
        <Select value={props.type} onChange={props.handleTypeChange}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Description"
        multiline
        minRows={7}
        variant="outlined"
        value={props.description}
        onChange={props.handleDescriptionChange}
        error={props.errorHandling}
        helperText={props.errorHandling && "Please enter a notice description!"}
        style={{ minWidth: "50%" }}
      />
    </>
  );
};

export default NoticeDescription;
