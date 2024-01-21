import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { enqueueSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { serverUrl } from "../../constants/constants";
import { useHistory } from "react-router-dom";

const options = ["Multiple Choice", "Short Answer", "Date & Time", "Petition"];

const useStyles = makeStyles(() => ({
  filledButton: {
    color: "#fff",
    "&:hover": {},
    textTransform: "none",
    flexGrow: 1,
    height: "44px",
    borderRadius: "8px",
  },
  filledSubmitButton: {
    background: "#4A74FF",
    borderRadius: "8px",
    color: "#FFFFFF",
    height: "58px",

    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontWeight: "590",
    fontSize: "20px",
    lineHeight: "22px",
    "&:hover": {
      background: "#4A74FF",
    },
    marginTop: "auto",
    textTransform: "none",
  },
}));

const CreatePoll = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [selectedType, setSelectedType] = useState("Multiple Choice");

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [petitionMember, setPetitionMember] = useState<any>(null);
  const [mcOptions, setMcOptions] = useState(["", ""]);

  const [mcDays, setMcDays] = useState(4);
  const currentUser = props.currentUser;

  const postalCode = "N2L3W9";

  const [members, setMembers] = useState<any>([]);

  const handleMcDaysChange = (event: Event, newValue: number | number[]) => {
    setMcDays(newValue as number);
  };

  const addMcOption = () => {
    setMcOptions([...mcOptions, ""]);
  };

  const updateMcOption = (option: number, newValue: string) => {
    const newOptions = [...mcOptions];

    newOptions[option] = newValue;
    setMcOptions(newOptions);
  };

  const deleteMcOption = (option: number) => {
    const newOptions = [...mcOptions];
    newOptions.splice(option, 1);
    setMcOptions(newOptions);
  };

  const getVariant = (option: string) => {
    if (selectedType === option) {
      return "contained";
    } else {
      return "outlined";
    }
  };

  const loadMembers = () => {
    fetch(`${serverUrl}/services/voice/electedmembers/${postalCode}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const members = data.representatives_centroid;
        // get unique members
        const uniqueMembers = members.filter(
          (member: any, index: number) =>
            members.findIndex((m: any) => m.name === member.name) === index
        );

        setMembers(uniqueMembers);
      });
  };

  const savePoll = () => {
    let desc = description;

    if (selectedType === "Petition" && petitionMember) {
      const petitionText = `
      Petitioned To: 
      ${petitionMember.elected_office} ${petitionMember.name}
      ${petitionMember.district_name} ${petitionMember.representative_set_name}
      ${petitionMember.email} ${petitionMember.url}
      Petition Details:
      ====
      `;

      desc = `${petitionText} \n ${description}`;
    }

    const resultAnswer = {
      question: question,
      description: desc,
      is_mc: selectedType === "Multiple Choice" || selectedType === "Petition",
      is_shortanswer: selectedType === "Short Answer",
      is_datetime: selectedType === "Date & Time",
      duration_days: mcDays,
      status: "active",
      user_id: currentUser?.user_id ?? 1,
      voice_mc: selectedType === "Multiple Choice" ? mcOptions : [],
    };

    fetch(`${serverUrl}/services/voice/add`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultAnswer),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        enqueueSnackbar("Prompted the community's voice!", {
          variant: "success",
        });

        setQuestion("");
        setDescription("");
        setMcOptions(["", ""]);
        setMcDays(4);
        setPetitionMember(null);
        history.push("/voice");
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar("Sorry, error - voice was not saved!", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (selectedType !== "Petition") {
      setPetitionMember(null);
    }
  }, [selectedType]);

  return (
    <>
      <Grid container spacing={2} style={{ overflowX: "hidden" }}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollbarWidth: "none",
            flexWrap: "nowrap",
            scrollbarColor: "transparent transparent",
            justifyContent: "flex-start",
          }}
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={options.length > 0 ? options[0] : ""}
              name="radio-buttons-group"
              row
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
            >
              <div className="flex space-x-3 ">
                {options.map((option, i) => {
                  return (
                    <section className="flex-shrink-0 scrollbar-hide" key={i}>
                      <Button
                        variant={getVariant(option)}
                        className={`${classes.filledButton} flex-shrink-0 rounded-full `}
                        style={{
                          border:
                            selectedType !== option ? "solid #BFBFBF 1px " : "",
                          color: selectedType !== option ? "#1D3557" : "",
                        }}
                      >
                        <FormControlLabel
                          value={option}
                          control={
                            <Radio
                              style={{
                                color:
                                  selectedType === option ? "#fff" : "#8C8C8C",
                              }}
                            />
                          }
                          label={option}
                        />
                      </Button>
                    </section>
                  );
                })}
              </div>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="What is your question?"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Anything to add?"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        {selectedType === "Multiple Choice" && (
          <>
            {mcOptions.map((option, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <Grid
                    container
                    spacing={2}
                    className={"flex align-middle"}
                    style={{ display: "flex" }}
                  >
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        variant="outlined"
                        value={mcOptions[index]}
                        onChange={(e) => updateMcOption(index, e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => deleteMcOption(index)}
                        className={"align-middle"}
                        style={{
                          alignContent: "center",
                          marginTop: "7px",
                          marginLeft: "5px",
                        }}
                      >
                        <DeleteIcon className={"align-middle"} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                className={`${classes.filledButton} flex-shrink-0 rounded-full `}
                style={{ color: "#1D3557", border: "none" }}
                startIcon={<AddIcon />}
                onClick={addMcOption}
              >
                Add Option
              </Button>
            </Grid>
          </>
        )}

        {selectedType === "Petition" && (
          <>
            {mcOptions.map((option, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <Grid
                    container
                    spacing={2}
                    className={"flex align-middle"}
                    style={{ display: "flex" }}
                  >
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        variant="outlined"
                        value={mcOptions[index]}
                        onChange={(e) => updateMcOption(index, e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => deleteMcOption(index)}
                        className={"align-middle"}
                        style={{
                          alignContent: "center",
                          marginTop: "7px",
                          marginLeft: "5px",
                        }}
                      >
                        <DeleteIcon className={"align-middle"} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                className={`${classes.filledButton} flex-shrink-0 rounded-full `}
                style={{ color: "#1D3557", border: "none" }}
                startIcon={<AddIcon />}
                onClick={addMcOption}
              >
                Add Option
              </Button>
            </Grid>

            <Grid item xs={12}>
              {members.length > 0 && (
                <Autocomplete
                  options={members}
                  getOptionLabel={(option: any) =>
                    `${option.elected_office} ${option.name} - ${option.district_name}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Elected Members" />
                  )}
                  onChange={(event, newValue) => {
                    setPetitionMember(newValue);
                  }}
                  value={petitionMember}
                  fullWidth
                  disablePortal
                />
              )}
            </Grid>
          </>
        )}

        {selectedType === "Date & Time" && (
          <>
            <Grid item xs={12}>
              <Typography gutterBottom>
                A date calendar will automatically be attached to your poll
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Grid item xs={12}>
            <Typography gutterBottom>Poll Duration</Typography>

            <Slider
              step={1}
              max={10}
              marks={true}
              value={mcDays}
              onChange={handleMcDaysChange}
              valueLabelDisplay="on"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              className={`${classes.filledSubmitButton}`}
              onClick={savePoll}
            >
              Create Poll
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreatePoll;
