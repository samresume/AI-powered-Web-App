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
    experiment: {
      dataset_name: "",
      description: "",
      data_type: "",
      file0: null,
      file1: null,
      preprocessing: false,
      znormalization: false,
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

  handleFile0Change = (e) => {
    let thenew = this.state.experiment;
    if (e.target.files) {
      thenew["file0"] = e.target.files[0];
      this.setState({ experiment: thenew });
    }
  };

  handleFile1Change = (e) => {
    let thenew = this.state.experiment;
    if (e.target.files) {
      thenew["file1"] = e.target.files[0];
      this.setState({ experiment: thenew });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ open: !this.state.open });

    if (
      !this.state.experiment.dataset_name ||
      !this.state.experiment.data_type ||
      !this.state.experiment.file0 ||
      !this.state.experiment.file1
    ) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }
    var mybody = new FormData();
    mybody.append("dataset_name", this.state.experiment.dataset_name);
    mybody.append("description", this.state.experiment.description);
    mybody.append("data_type", this.state.experiment.data_type);
    mybody.append("file0", this.state.experiment.file0);
    mybody.append("file1", this.state.experiment.file1);
    mybody.append("preprocessing", this.state.experiment.preprocessing);
    mybody.append("znormalization", this.state.experiment.znormalization);

    fetch("http://127.0.0.1:8000/solarflare/dataset/set_info/", {
      method: "POST",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
      body: mybody,
    })
      .then((resp) => resp.json())
      .then((res) => (window.location.href = "datasets"))
      .catch();
  };

  handleClose = () => {};

  handleChange = (event) => {
    let thenew = this.state.experiment;

    if (event.target.name === "Data Type") {
      thenew["data_type"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Name") {
      thenew["dataset_name"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Description") {
      thenew["description"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "PreProcessing") {
      thenew["preprocessing"] = event.target.checked;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "ZNormalization") {
      thenew["znormalization"] = event.target.checked;
      this.setState({ experiment: thenew });
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
          <h2 className={"h2"}>New Dataset</h2>
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
                value={this.state.experiment.dataset_name}
                onChange={this.handleChange}
                margin="normal"
                required
                fullWidth
                id="Name"
                label="Enter The Name of Dataset"
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
                <InputLabel className="font">Data Type</InputLabel>
                <Select
                  value={this.state.experiment.data_type}
                  label="Data Type"
                  name="Data Type"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="font" value={"mvts"}>
                    MVTS
                  </MenuItem>
                  <MenuItem disabled className="font" value={"fn"}>
                    Functional Network
                  </MenuItem>
                </Select>
                <FormHelperText>Select the Data Type</FormHelperText>
              </FormControl>

              <FormControl required fullWidth>
                <Input
                  required
                  theme={theme}
                  name="file0"
                  className="space-file"
                  fullWidth
                  variant="outlined"
                  type="file"
                  onChange={this.handleFile0Change}
                />
                <FormHelperText>
                  Upload the Train Data (CSV, XLSX, ODS, MAT, NPY, and so on.)
                </FormHelperText>
              </FormControl>

              <FormControl required fullWidth>
                <Input
                  theme={theme}
                  name="file1"
                  className="space-file"
                  fullWidth
                  variant="outlined"
                  type="file"
                  onChange={this.handleFile1Change}
                />
                <FormHelperText>
                  Upload the Labels (CSV, XLSX, ODS, MAT, NPY, and so on.)
                </FormHelperText>
              </FormControl>

              <FormGroup>
                <FormControlLabel
                  className="space-file"
                  label="Data PreProcessing"
                  name="PreProcessing"
                  onChange={this.handleChange}
                  control={
                    <Switch checked={this.state.experiment.preprocessing} />
                  }
                />
              </FormGroup>
              <FormHelperText>
                Does your data need a PreProcessing? (missing value imputation)
              </FormHelperText>

              {this.state.experiment.preprocessing ? (
                <>
                  <FormGroup>
                    <FormControlLabel
                      className="space-file"
                      label="Z Normalization"
                      name="ZNormalization"
                      onChange={this.handleChange}
                      control={
                        <Switch
                          checked={this.state.experiment.znormalization}
                        />
                      }
                    />
                  </FormGroup>
                  <FormHelperText>
                    Does your data need a Normalization? (Z Score Normalization)
                  </FormHelperText>
                </>
              ) : (
                <></>
              )}

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
                    Upload the Dataset
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
                    Upload the Dataset
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
                  Please Wait. You will be redirected to the Datasets Page
                  Automatically.
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
