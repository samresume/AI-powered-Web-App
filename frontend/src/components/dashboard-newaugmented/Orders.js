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
    datasets: [],
    data_type: null,
    isRequired: false,
    experiment: {
      dataset_name: "",
      description: "",

      dataset_id: null,
      data_augmentation: null,
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
  componentDidMount() {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/dataset/get_info", {
        method: "Get",
        headers: {
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((resp) => resp.json())
        .then((res) => this.setState({ datasets: res.data }))
        .catch();
    } else {
      window.location.href = "login";
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ open: !this.state.open });

    if (
      !this.state.experiment.dataset_name ||
      !this.state.experiment.dataset_id ||
      !this.state.experiment.data_augmentation
    ) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }

    fetch("http://127.0.0.1:8000/solarflare/augmented-dataset/set_info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
      body: JSON.stringify(this.state.experiment),
    })
      .then((resp) => resp.json())
      .then((res) => (window.location.href = "data-augmentation"))
      .catch();
  };

  handleFileChange = (files) => {
    // Update chosen files
  };

  handleClose = () => {};

  handleChange = (event) => {
    let thenew = this.state.experiment;

    if (event.target.name === "Data") {
      thenew["dataset_id"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Name") {
      thenew["dataset_name"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Description") {
      thenew["description"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Augmentation") {
      thenew["data_augmentation"] = event.target.value;
      this.setState({ experiment: thenew });
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <h2 className={"h2"}>New Graph Generation</h2>
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
              <TextField
                className="space"
                theme={theme}
                value={this.state.experiment.project_name}
                onChange={this.handleChange}
                margin="normal"
                required
                fullWidth
                id="Name"
                label="Enter The Name of Session"
                name="Name"
                autoFocus
              />
              <TextField
                className="space"
                theme={theme}
                value={this.state.experiment.description}
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
              <FormControl required className="space" fullWidth>
                <InputLabel className="font">Dataset</InputLabel>
                <Select
                  value={this.state.experiment.data}
                  label="Dataset"
                  name="Data"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.datasets.map((row) =>
                    row.data_type == "mvts" && row.status == "completed" ? (
                      <MenuItem
                        id={row.data_type}
                        className="font"
                        value={row.id}
                      >
                        {row.dataset_name}
                      </MenuItem>
                    ) : row.data_type == "mvts" && row.status == "running" ? (
                      <MenuItem
                        id={row.data_type}
                        className="font"
                        value={row.id}
                        disabled
                      >
                        {row.dataset_name}
                      </MenuItem>
                    ) : (
                      <></>
                    )
                  )}
                </Select>
                <FormHelperText>Select one of your Datasets</FormHelperText>
              </FormControl>
              <FormControl required className="space" fullWidth>
                <InputLabel className="font">Data Augmentation</InputLabel>
                <Select
                  value={this.state.experiment.data_augmentation}
                  label="Data Augmentation"
                  name="Augmentation"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="font" value={"smote"}>
                    SMOTE
                  </MenuItem>
                  <MenuItem className="font" value={"timegan"}>
                    TimeGan
                  </MenuItem>
                  <MenuItem className="font" value={"gni"}>
                    Gaussian Noise Injections
                  </MenuItem>
                </Select>
                <FormHelperText>
                  Select the Data Augmentation Technique
                </FormHelperText>
              </FormControl>

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
                    Create Dataset
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
                    Create Dataset
                  </Button>
                )}
              </div>

              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={this.state.open}
                onClick={this.handleClose}
              >
                <lable>
                  {" "}
                  Please Wait. You will be redirected to the Data Augmentation
                  Page Automatically.
                </lable>
                <CircularProgress color="inherit" />
              </Backdrop>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default withCookies(Orders);
