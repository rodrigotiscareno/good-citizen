import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MyAppBar from "../MyAppBar";

import { serverUrl } from "../../constants/constants";
import TabBar from "../TabBar";
import { useAuth } from "../Firebase/firebase";

const Assistant = (props) => {
  var today = new Date();
  var curHr = today.getHours();
  let welcomeMessage;
  const currentUser = useAuth();
  let authenticated = Boolean(currentUser);

  if (curHr < 12) {
    welcomeMessage = "Good Morning";
  } else if (curHr < 18) {
    welcomeMessage = "Good Afternoon";
  } else {
    welcomeMessage = "Good Evening";
  }

  const [smessages, setSMessages] = useState<any>([]);
  const [enteredMessage, setEnteredMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [mood, setMood] = useState("Insightful");
  const [answerLength, setAnswerLength] = useState("Short");

  const sendMessage = () => {
    const newMessages = smessages;

    newMessages.push({
      role: "user",
      content: enteredMessage,
      date: new Date(),
    });

    setSMessages(newMessages);
    setEnteredMessage("");
    setIsLoading(true);
    fetch(`${serverUrl}/services/chat/prompt`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages,
        mood: mood,
        answerLength: answerLength,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length === 0) {
          return;
        }

        const newMessages = smessages;
        setIsLoading(false);
        const nmp = {
          role: "assistant",
          content: data[0].message.content,
          date: new Date(),
        };
        setIsLoading(false);
        console.log(newMessages);

        setSMessages([...smessages, nmp]);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const nmp = {
      role: "assistant",
      content:
        "Hey! I'm Ava. How can I help you? You can ask me questions about your neighborhood!",
      date: new Date(),
    };

    setSMessages([nmp]);
  }, [setSMessages]);

  return (
    <>
      <MyAppBar authenticated={authenticated} showBackButton={true} />
      <div>
        <section aria-labelledby="notes-title">
          <div className="bg-white shadow  sm:rounded-lg">
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold ">{welcomeMessage}</h1>
              </div>
              <div className="px-4 py-6 sm:px-6">
                <ul role="list" className="space-y-8">
                  {smessages &&
                    smessages.map((message, i) => (
                      <li key={i}>
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <strong>
                              {" "}
                              {message.role === "user" ? "You" : "Ava"}
                            </strong>
                          </div>
                          <div>
                            <div className="text-sm">
                              <p>{message.content}</p>
                            </div>
                            <div className="mt-1 text-sm text-gray-700"></div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="fixed inset-x-0" style={{ bottom: 55 }}>
              <div className="bg-gray-50 px-4 py-6 sm:px-6">
                <div className="flex space-x-3">
                  <div className="min-w-0 flex-1">
                    <form action="#">
                      <div>
                        <label htmlFor="comment" className="sr-only">
                          About
                        </label>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          variant="outlined"
                          id="comment"
                          name="comment"
                          className="block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          placeholder="Ask me anything!"
                          value={enteredMessage}
                          onChange={(e) => setEnteredMessage(e.target.value)}
                        />
                      </div>

                      <div className="mt-3 "></div>
                      <div className="mt-3 flex items-center justify-between">
                        <Button
                          variant="contained"
                          className="inline-flex items-center justify-right rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          onClick={sendMessage}
                        >
                          Send
                        </Button>

                        <Accordion
                          variant="outlined"
                          style={{
                            backgroundColor: "transparent",
                            marginTop: 10,
                            height: "30",
                            margin: 0,
                            marginLeft: "16px",
                          }}
                        >
                          <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{
                              backgroundColor: "transparent",
                            }}
                          >
                            <Typography>Persona</Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            style={{
                              marginTop: 0,
                              backgroundColor: "transparent",
                            }}
                          >
                            <Grid
                              container
                              direction="column"
                              className={"mt-2"}
                            >
                              <Grid item xs={12}>
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={mood}
                                    onChange={(e) => setMood(e.target.value)}
                                  >
                                    <FormControlLabel
                                      value="Fun"
                                      control={<Radio />}
                                      label="Fun"
                                    />
                                    <FormControlLabel
                                      value="Curious"
                                      control={<Radio />}
                                      label="Curious"
                                    />
                                    <FormControlLabel
                                      value="Insightful"
                                      control={<Radio />}
                                      label="Insightful"
                                    />
                                    <FormControlLabel
                                      value="Depressed"
                                      disabled
                                      control={<Radio />}
                                      label="Depressed"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              <Divider />
                              <Grid item xs={12}>
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={answerLength}
                                    onChange={(e) => {
                                      setAnswerLength(e.target.value);
                                    }}
                                  >
                                    <FormControlLabel
                                      value="Simple"
                                      control={<Radio />}
                                      label="Simple"
                                    />
                                    <FormControlLabel
                                      value="Short"
                                      control={<Radio />}
                                      label="Short"
                                    />
                                    <FormControlLabel
                                      value="Detailed"
                                      control={<Radio />}
                                      label="Detailed"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <TabBar />
    </>
  );
};

export default Assistant;
