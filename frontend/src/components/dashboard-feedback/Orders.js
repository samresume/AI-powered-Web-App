import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import { Input } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Component } from "react";
import { withCookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { grey, orange, red } from "@mui/material/colors";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { Rating } from "@mui/lab";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Solar Flare Prediction
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const font = "'Assistant', sans-serif";

const theme = createTheme({
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12,
    fontFamily: font,
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: orange[400],
    },
  },
});

class Orders extends Component {
  state = {
    open: false,
    token: this.props.cookies.get("user-token"),
    captchaResult: "",
    isRequired: false,
    feedback: {
      title: "",
      description: "",
      score: null,
    },
    snackbar: false,
  };

  snackClose = () => {
    this.setState({ snackbar: false });
  };

  handleRecaptcha = (value) => {
    fetch("http://127.0.0.1:8000/recaptcha/", {
      method: "POST",
      body: JSON.stringify({ captcha_value: value }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.captcha.success);
        this.setState({ captchaResult: data.captcha.success });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ open: true });

    if (!this.state.feedback.title || !this.state.feedback.score) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }

    var mybody = new FormData();
    mybody.append("title", this.state.feedback.title);
    mybody.append("description", this.state.feedback.description);
    mybody.append("score", this.state.feedback.score);

    fetch("http://127.0.0.1:8000/solarflare/feedback/set_info/", {
      method: "POST",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
      body: mybody,
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ open: false, snackbar: true });
        window.location.href = "dashboard";
      })
      .catch(this.setState({ open: false }));
  };

  handleClose = () => {};

  handleChange = (event) => {
    let thenew = this.state.feedback;

    if (event.target.name === "Title") {
      thenew["title"] = event.target.value;
      this.setState({ feedback: thenew });
    } else if (event.target.name === "Description") {
      thenew["description"] = event.target.value;
      this.setState({ feedback: thenew });
    } else if (event.target.name === "Score") {
      thenew["score"] = event.target.value;
      this.setState({ feedback: thenew });
    }
  };

  componentDidMount() {
    if (this.state.token) {
    } else {
      window.location.href = "login";
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <h2 className={"h2"}>Feedback</h2>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2} sx={{ maxWidth: "350px" }}>
                <Grid item xs={12}>
                  <TextField
                    className="space"
                    theme={theme}
                    value={this.state.feedback.title}
                    onChange={this.handleChange}
                    margin="normal"
                    required
                    fullWidth
                    id="Title"
                    label="Title"
                    name="Title"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className="space"
                    theme={theme}
                    value={this.state.feedback.description}
                    onChange={this.handleChange}
                    margin="normal"
                    fullWidth
                    id="description"
                    name="Description"
                    label="Description"
                    multiline
                    rows={5}
                    defaultValue="Default Value"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className="space" component="legend">
                    Score
                  </Typography>
                  <Rating
                    name="Score"
                    value={this.state.feedback.score}
                    onChange={this.handleChange}
                    defaultValue={5}
                  />
                  <FormHelperText sx={{ mt: 1 }}>
                    Select the Score (1 to 5)
                  </FormHelperText>
                </Grid>

                <Grid item xs={12}>
                  <Grid container>
                    <Grid className={"incorrect"} item sx={{ mt: 3, mb: 2 }}>
                      <p href="#" variant="body2">
                        {this.state.isRequired === true
                          ? "Please fill out all the necessary inputs!"
                          : ""}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <div className="cta">
                    <ReCAPTCHA
                      sitekey="6LeJXKgmAAAAAPF5d3lOMAL8pwypyz_0omAu7zUw"
                      onChange={this.handleRecaptcha}
                    />
                    {this.state.captchaResult ? (
                      <Button
                        onClick={this.handleSubmit}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        onClick={this.handleSubmit}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </Grid>

                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={this.state.open}
                  onClick={this.handleClose}
                >
                  <h3> Please Wait.</h3>
                  <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    sx={{
                      ml: 2,
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#000000" : "#000000",
                      animationDuration: "550ms",
                      [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: "round",
                      },
                    }}
                    size={40}
                    thickness={4}
                  />
                </Backdrop>
                <Snackbar
                  open={this.state.snackbar}
                  autoHideDuration={6000}
                  onClose={this.snackClose}
                >
                  <Alert
                    onClose={this.snackClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Your Feedback Has Been Sent Successfully. Thank you.
                  </Alert>
                </Snackbar>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default withCookies(Orders);
