import React, { useEffect, useState } from "react";
import { FlagIcon, ShareIcon } from "@heroicons/react/20/solid";
import { useHistory } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DateCalendar, TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CommentsBox from "../Comments";
import { VoiceModelUI } from "../../../../shared/voice";
import { enqueueSnackbar } from "notistack";

import { serverUrl } from "../../constants/constants";

const ViewPolls = (props) => {
  const neighboorhoodId = props.currentUser.neighborhood_id;
  const userId = props.currentUser.user_id;
  enum Sort {
    RECENT,
    POPULAR,
    RANDOM,
  }

  const [alignment, setAlignment] = React.useState<string | null>("left");
  const [dateResult, setDateResult] = useState<{
    date?: Date;
    time?: Date;
    voice_id?: number;
  } | null>(null);
  const [result, setResult] = useState<{
    answer: string;
    voice_id: number;
  } | null>(null);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  const getFeed = () => {
    fetch(
      `${serverUrl}/services/voice/byneighboorhood/${neighboorhoodId}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAllVoicePosts(data.results);
      });
  };

  const saveResult = (voiceId: number) => {
    let resultAnswer = "";
    if (dateResult != null) {
      resultAnswer = `${dateResult.date} ${dateResult.time}`;
    } else {
      resultAnswer = result?.answer || "";
    }

    fetch(`${serverUrl}/services/voice/${voiceId}/result/add`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        answer: resultAnswer,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        enqueueSnackbar("Voiced!", { variant: "success" });
        getFeed();
        setResult(null);
      })
      .catch(() => {
        enqueueSnackbar("Sorry, error - our voice was not saved!", {
          variant: "error",
        });
      });
  };

  const flagVoice = (id) => {
    fetch(`${serverUrl}/api/flagVoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voiceId: flagVoiceId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getFeed();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getFeed();
  }, []);

  const resort = (sort: Sort) => {
    if (sort === Sort.POPULAR) {
      // sort voice by number of comments
      const sorted = voiceFeed?.sort((a, b) => {
        if (!a.comments || !b.comments) {
          return 0;
        }

        return b.comments.length - a.comments.length;
      });
      setVoiceFeed(sorted);
    } else if (sort === Sort.RANDOM) {
      // sort voice by random
      const sorted = voiceFeed?.sort((a, b) => {
        return Math.random() - 0.5;
      });
      setVoiceFeed(sorted);
    } else {
      // sort voice by date
      const sorted = voiceFeed?.sort((a, b) => {
        return b.voice_id - a.voice_id;
      });
      setVoiceFeed(sorted);
    }
  };

  const [sentimentSlider, setSentimentSlider] = React.useState<number>(1);

  const handleConfirmFlagClose = () => {
    setFlagVoiceId(null);
  };

  const [allVoicePosts, setAllVoicePosts] = React.useState<VoiceModelUI[]>();
  const [voiceFeed, setVoiceFeed] = React.useState<VoiceModelUI[]>();
  const [flagVoiceId, setFlagVoiceId] = React.useState<number | null>(null);
  const history = useHistory();

  useEffect(() => {
    const feed = allVoicePosts;

    const newFeed = feed?.filter(
      (voice) =>
        !voice.meta_analysis ||
        voice.meta_analysis.sentimentScore <= sentimentSlider
    );

    setVoiceFeed(newFeed);
  }, [sentimentSlider, allVoicePosts]);

  return (
    <>
      <Dialog open={flagVoiceId !== null} onClose={handleConfirmFlagClose}>
        <DialogTitle>
          {"Are you sure you want to flag this voice post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By flagging this voice post as inappropriate, this voice post will
            be immediately unpublished until it is reviewed by a moderator.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmFlagClose}>Cancel</Button>
          <Button onClick={flagVoice}>Flag as Inappropriate</Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        style={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 50,
          left: "auto",
          position: "fixed",
        }}
        onClick={() => history.push("/voice/new")}
      >
        <AddIcon />
      </Fab>

      <div className="min-h-full">
        <div className="py-3">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            defaultValue={alignment ?? undefined}
            aria-label="text alignment"
            fullWidth
          >
            <ToggleButton
              value="right"
              aria-label="right aligned"
              onClick={() => {
                resort(Sort.POPULAR);
              }}
            >
              Popular
            </ToggleButton>
            <ToggleButton
              value="center"
              aria-label="centered"
              onClick={() => {
                resort(Sort.RECENT);
              }}
            >
              Recent
            </ToggleButton>
            <ToggleButton
              value="justify"
              aria-label="justified"
              onClick={() => {
                resort(Sort.RANDOM);
              }}
            >
              Random
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid container>
            <Grid item xs={11} style={{ padding: 8 }}>
              <Slider
                value={sentimentSlider}
                onChange={(event, newValue) => {
                  setSentimentSlider(newValue as number);
                }}
                defaultValue={1}
                step={0.01}
                valueLabelDisplay="auto"
                min={-1}
                max={1}
                marks={[
                  {
                    value: -1,
                    label: "Sad",
                  },
                  {
                    value: 0,
                    label: "0 (Neutral)",
                  },

                  {
                    value: 1,
                    label: "Happy",
                  },
                ]}
              />
            </Grid>
          </Grid>

          <div className="">
            <main className="">
              <div className="mt-4">
                <ul role="list" className="space-y-4">
                  {voiceFeed &&
                    voiceFeed?.map((voice: any, i) => (
                      <li
                        key={i}
                        className="bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6"
                      >
                        <article>
                          <div>
                            <div className="flex space-x-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  <a href={""} className="hover:underline">
                                    {`${voice.user.first_name} ${voice.user.last_name}`}
                                  </a>
                                </p>
                                <p className="text-sm text-gray-500">
                                  <a href={""} className="hover:underline">
                                    <time dateTime={voice.created_on}>
                                      {dayjs(voice.created_on).format(
                                        "MMM D, YYYY h:MM A"
                                      )}
                                    </time>
                                  </a>
                                </p>
                              </div>
                            </div>
                            <h2
                              id={"question-title-" + voice.voice_id}
                              className="mt-4 text-base font-medium text-gray-900"
                            >
                              {voice.question}
                            </h2>
                          </div>
                          <div
                            className="mt-2 space-y-4 text-sm text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: voice.description,
                            }}
                          ></div>
                          <div className="mt-2 space-y-4 text-sm text-gray-700">
                            {voice.voice_results.map((item) => {
                              if (item.user_id === userId) {
                                return (
                                  <Alert severity="success">
                                    <AlertTitle>
                                      <strong>{item.answer}</strong>
                                    </AlertTitle>
                                    Voiced on {item.created_on}
                                  </Alert>
                                );
                              }
                            })}
                            <>
                              {voice.voice_results.length <= 0 &&
                                voice.is_mc && (
                                  <Grid container>
                                    <Grid item xs={12}>
                                      <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                                        <RadioGroup
                                          onChange={(e) =>
                                            setResult({
                                              voice_id: voice.voice_id,
                                              answer: e.target.value,
                                            })
                                          }
                                        >
                                          {voice.voice_mc.map(
                                            (option: any, i) => (
                                              <FormControlLabel
                                                key={`${option.voice_mc_id}-${i}`}
                                                value={option.title}
                                                control={<Radio />}
                                                label={option.title}
                                              />
                                            )
                                          )}
                                        </RadioGroup>
                                      </FormControl>
                                    </Grid>
                                    {result?.voice_id === voice.voice_id && (
                                      <Grid item xs={12}>
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          className="mt-4 w-3"
                                          onClick={() =>
                                            saveResult(voice.voice_id)
                                          }
                                        >
                                          Save
                                        </Button>
                                      </Grid>
                                    )}
                                  </Grid>
                                )}

                              {voice.voice_results.length <= 0 &&
                                voice.is_shortanswer && (
                                  <>
                                    <TextField
                                      multiline
                                      rows={4}
                                      variant="outlined"
                                      fullWidth
                                      placeholder="Type your answer here"
                                      onChange={(e) =>
                                        setResult({
                                          voice_id: voice.voice_id,
                                          answer: e.target.value,
                                        })
                                      }
                                    />

                                    {result?.voice_id === voice.voice_id && (
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        className="mt-4 w-3"
                                        onClick={() =>
                                          saveResult(voice.voice_id)
                                        }
                                      >
                                        Save
                                      </Button>
                                    )}
                                  </>
                                )}

                              {voice.voice_results.length <= 0 &&
                                voice.is_datetime && (
                                  <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DateCalendar
                                          onChange={(newValue) => {
                                            const rt = { ...dateResult };

                                            if (
                                              rt.voice_id === voice.voice_id
                                            ) {
                                              rt.time = newValue as Date;
                                            } else {
                                              rt.voice_id = voice.voice_id;
                                              rt.date = new Date();
                                              rt.time = newValue as Date;
                                            }

                                            setDateResult(rt);
                                          }}
                                        />
                                      </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <TimeField
                                          label="Pick a time"
                                          value={dayjs("2022-04-17T15:30")}
                                          onChange={(newValue) => {
                                            const rt = { ...dateResult };

                                            if (
                                              rt.voice_id === voice.voice_id
                                            ) {
                                              rt.time = newValue?.toDate();
                                            } else {
                                              rt.voice_id = voice.voice_id;
                                              rt.date = new Date();
                                              rt.time = newValue?.toDate();
                                            }

                                            setDateResult(rt);
                                          }}
                                          fullWidth
                                        />
                                      </LocalizationProvider>
                                    </Grid>
                                    {dateResult?.voice_id === voice.voice_id &&
                                      dateResult?.date &&
                                      dateResult.time && (
                                        <Grid item xs={4}>
                                          <Button
                                            variant="outlined"
                                            color="primary"
                                            className="w-3"
                                            onClick={() => {
                                              saveResult(voice.voice_id);
                                            }}
                                          >
                                            Save
                                          </Button>
                                        </Grid>
                                      )}
                                  </Grid>
                                )}
                            </>
                          </div>
                          <div className="mt-6 flex justify-between space-x-8">
                            <div className="flex space-x-6">
                              <CommentsBox
                                currentUser={props.currentUser}
                                id={voice.voice_id}
                                initComments={voice.comments}
                              />
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                  onClick={() => setFlagVoiceId(voice.voice_id)}
                                >
                                  <FlagIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-gray-900"></span>
                                </button>
                              </span>
                            </div>
                            <div className="flex text-sm">
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `https://localhost:3000/voice/${voice.voice_id}`
                                    );
                                    enqueueSnackbar("Share link copied");
                                  }}
                                >
                                  <ShareIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-gray-900">
                                    Share
                                  </span>
                                </button>
                              </span>
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                </ul>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPolls;
