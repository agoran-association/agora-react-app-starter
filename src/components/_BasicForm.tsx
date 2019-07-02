import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import { ClientConfig } from "agora-rtc-sdk";

import { DarkThemeProvider } from "../configures/_configureTheme";
import useCamera from "../hooks/_useCamera";
import useMicrophone from "../hooks/_useMicrophone";

const useStyles = makeStyles(theme => ({
  advanceSettings: {
    marginTop: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around"
  },
  buttonItem: {
    width: "38.2%"
  }
}));

export interface BasicFormProps {
  appId: string;
  channel: string;
  uid: string;
  token?: string;
  cameraId?: string;
  microphoneId?: string;
  mode: ClientConfig["mode"];
  codec: ClientConfig["codec"];

  onChange: (key: string, value: any) => void;
  onClick: (key: string) => void;

  isPublished: boolean;
  isJoined: boolean;
  isLoading: boolean;
}

const BasicForm: React.FC<BasicFormProps> = props => {
  const cameraList = useCamera();
  const microphoneList = useMicrophone();
  const classes = useStyles();
  const { isPublished, isJoined, isLoading } = props;

  const handleChange = (key: string) => (e: React.ChangeEvent<unknown>) => {
    return props.onChange(key, (e.target as HTMLInputElement).value);
  };

  const handleClick = (key: string) => (e: React.ChangeEvent<unknown>) => {
    return props.onClick(key);
  };

  const JoinLeaveBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        color={isJoined ? "secondary" : "primary"}
        onClick={isJoined ? handleClick("leave") : handleClick("join")}
        variant="contained"
        disabled={isLoading}
      >
        {isJoined ? "Leave" : "Join"}
      </Button>
    );
  };

  const PubUnpubBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        color={isPublished ? "secondary" : "default"}
        onClick={
          isPublished ? handleClick("unpublish") : handleClick("publish")
        }
        variant="contained"
        disabled={!isJoined || isLoading}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <form noValidate autoComplete="off">
            <TextField
              required
              value={props.appId}
              onChange={handleChange("appId")}
              id="appId"
              label="App ID"
              fullWidth
              margin="normal"
            />
            <TextField
              required
              value={props.channel}
              onChange={handleChange("channel")}
              id="channel"
              label="Channel"
              fullWidth
              margin="normal"
            />

            <TextField
              value={props.token}
              onChange={handleChange("token")}
              id="token"
              label="Token"
              fullWidth
              margin="normal"
            />
          </form>
        </CardContent>
        <CardActions className={classes.buttonContainer}>
          <JoinLeaveBtn />
          <PubUnpubBtn />
        </CardActions>
      </Card>

      {/* advanced settings */}
      <DarkThemeProvider>
        <ExpansionPanel className={classes.advanceSettings}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced Settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form noValidate autoComplete="off">
              <TextField
                value={props.uid}
                id="uid"
                onChange={handleChange("uid")}
                label="UID"
                fullWidth
                margin="normal"
              />
              <TextField
                id="cameraId"
                value={props.cameraId}
                onChange={handleChange("cameraId")}
                select
                label="Camera"
                helperText="Please select your camera"
                fullWidth
                margin="normal"
              >
                {cameraList.map(item => (
                  <MenuItem key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="microphoneId"
                value={props.microphoneId}
                onChange={handleChange("microphoneId")}
                select
                label="Microphone"
                helperText="Please select your microphone"
                fullWidth
                margin="normal"
              >
                {microphoneList.map(item => (
                  <MenuItem key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>

              <FormControl fullWidth component="fieldset" margin="normal">
                <FormLabel>Mode</FormLabel>
                <RadioGroup
                  row
                  value={props.mode}
                  onChange={handleChange("mode")}
                >
                  <FormControlLabel
                    value="live"
                    control={<Radio color="primary" />}
                    label="live"
                  />
                  <FormControlLabel
                    value="rtc"
                    control={<Radio color="primary" />}
                    label="rtc"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth component="fieldset" margin="normal">
                <FormLabel>Codec</FormLabel>
                <RadioGroup
                  row
                  value={props.codec}
                  onChange={handleChange("codec")}
                >
                  <FormControlLabel
                    value="vp8"
                    control={<Radio color="primary" />}
                    label="vp8"
                  />
                  <FormControlLabel
                    value="h264"
                    control={<Radio color="primary" />}
                    label="h264"
                  />
                </RadioGroup>
              </FormControl>
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DarkThemeProvider>
    </React.Fragment>
  );
};

export default BasicForm;
