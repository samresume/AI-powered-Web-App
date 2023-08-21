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
import CircularProgress from "@mui/material/CircularProgress";
import { Component } from "react";
import { withCookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { grey, orange, red } from "@mui/material/colors";

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
    profile: {
      name: "",
      type: "",
      country: "",
    },
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
    this.setState({ open: !this.state.open });

    if (
      !this.state.profile.name ||
      !this.state.profile.type ||
      !this.state.profile.country
    ) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }

    var mybody = new FormData();
    mybody.append("name", this.state.profile.name);
    mybody.append("type", this.state.profile.type);
    mybody.append("country", this.state.profile.country);

    fetch("http://127.0.0.1:8000/solarflare/user-info/set_info/", {
      method: "POST",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
      body: mybody,
    })
      .then((resp) => resp.json())
      .then((res) => (window.location.href = "profile"))
      .catch();
  };

  inputChanged = (event) => {
    let thenew = this.state.profile;

    if (event.target.name === "Name") {
      thenew["name"] = event.target.value;
      this.setState({ profile: thenew });
    } else if (event.target.name === "Type") {
      thenew["type"] = event.target.value;
      this.setState({ profile: thenew });
    } else if (event.target.name === "Country") {
      thenew["country"] = event.target.value;
      this.setState({ profile: thenew });
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
          <h2 className={"h2"}>Edit Profile</h2>
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
                    required
                    theme={theme}
                    value={this.state.profile.name}
                    onChange={this.inputChanged}
                    fullWidth
                    id="name"
                    label="New Full Name"
                    name="Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl required className="space" fullWidth>
                    <InputLabel className="font">Select Your Usage</InputLabel>
                    <Select
                      fullWidth
                      required
                      value={this.state.profile.type}
                      label="Select Your Usage"
                      name="Type"
                      onChange={this.inputChanged}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem className="font" value={"personal"}>
                        Personal
                      </MenuItem>
                      <MenuItem className="font" value={"organization"}>
                        Organization
                      </MenuItem>
                      <MenuItem className="font" value={"school"}>
                        School
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl required className="space" fullWidth>
                    <InputLabel className="font">
                      Select Your Country
                    </InputLabel>
                    <Select
                      fullWidth
                      value={this.state.profile.country}
                      label="Select Your Country"
                      name="Country"
                      onChange={this.inputChanged}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem className="font" value={"unitedstates"}>
                        United States
                      </MenuItem>
                      <MenuItem className="font" value={"canada"}>
                        Canada
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                  onClick={this.inputChanged}
                >
                  <lable>
                    {" "}
                    Please Wait. You will be redirected to the Profile Page
                    Automatically.
                  </lable>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default withCookies(Orders);
