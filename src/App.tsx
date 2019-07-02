import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import StreamPlayer from "agora-stream-player";
import { ClientConfig } from "agora-rtc-sdk";

import { useSnackbar } from "./configures/_configureSnackbar";
import { useMediaStream } from "./hooks";
import AgoraRTC from "./configures/_configureAgoraRTC";
import BasicForm from "./components/_BasicForm";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 12
  },
  title: {
    fontWeight: 400
  },
  divider: {
    marginBottom: "32px"
  }
}));

const defaultState: {
  appId: string;
  channel: string;
  uid: string;
  token?: string;
  cameraId?: string;
  microphoneId?: string;
  mode: ClientConfig["mode"];
  codec: ClientConfig["codec"];
} = {
  appId: "",
  channel: "",
  uid: "",
  token: undefined,
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264"
};

function App() {
  const classes = useStyles();
  const [isJoined, setisJoined] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState(defaultState);
  const [agoraClient, setClient] = useState<any>(undefined);

  let [localStream, remoteStreamList] = useMediaStream(agoraClient);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (key: string, value: any) => {
    setConfig(config => Object.assign({}, config, {
      [key]: value
    }))
  };

  const handleClick = (key: string) => {
    switch (key) {
      case "join":
        join();
        break;
      case "publish":
        publish();
        break;
      case "leave":
        leave();
        break;
      case "unpublish":
        unpublish();
        break;
    }
  };

  const join = async () => {
    const client = AgoraRTC.createClient({
      mode: config.mode,
      codec: config.codec
    });
    setClient(client);
    setIsLoading(true);
    try {
      const uid = isNaN(Number(config.uid)) ? null : Number(config.uid);
      await client.init(config.appId);
      await client.join(config.token || "", config.channel, uid);
      const stream = AgoraRTC.createStream({
        streamID: uid || 12345,
        video: true,
        audio: true,
        screen: false
      });
      // stream.setVideoProfile('480p_4')
      await stream.init();
      await client.publish(stream);
      setIsPublished(true);
      setisJoined(true);
      enqueueSnackbar(`Joined channel ${config.channel}`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const publish = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        await agoraClient.publish(localStream);
        setIsPublished(true);
      }
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const leave = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        localStream.close();
        agoraClient.unpublish(localStream);
      }
      await agoraClient.leave();
      setIsPublished(false);
      setisJoined(false);
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const unpublish = () => {
    if (localStream) {
      agoraClient.unpublish(localStream);
      setIsPublished(false);
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  return (
    <React.Fragment>
      {/* header */}
      <AppBar color="primary">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Basic Communication
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.divider} />

      {/* body */}
      <Container>
        <Grid container spacing={3}>
          {/* form */}
          <Grid item xs={12} md={4}>
            <BasicForm
              onClick={handleClick}
              onChange={handleChange}
              {...config}
              isPublished={isPublished}
              isJoined={isJoined}
              isLoading={isLoading}
            />
          </Grid>

          {/* display area */}
          <Grid item xs={12} md={8}>
            {localStream && (
              <StreamPlayer stream={localStream} fit="contain" label="local" />
            )}
            {remoteStreamList.map((stream: any) => (
              <StreamPlayer
                stream={stream}
                fit="contain"
                label={stream.getId()}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default App;
