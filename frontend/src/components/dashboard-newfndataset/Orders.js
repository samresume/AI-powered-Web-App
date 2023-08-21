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
import Divider from "@mui/material/Divider";

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

const marks = [
  {
    value: -1,
    label: "-1",
  },
  {
    value: 0,
    label: "0",
  },
  {
    value: +1,
    label: "+1",
  },
];

class Orders extends Component {
  state = {
    open: false,
    token: this.props.cookies.get("user-token"),
    captchaResult: "",
    datasets: [],
    augmented_datasets: [],
    data_type: null,
    isRequired: false,
    experiment: {
      dataset_name: "",
      description: "",

      data: null,
      dataset_id: null,
      dataset: null,
      pearson: 0.0,
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
        .then((res) => {
          this.setState({ datasets: res.data });
          fetch("http://127.0.0.1:8000/solarflare/augmented-dataset/get_info", {
            method: "Get",
            headers: {
              Authorization: `Token ${this.state.token}`,
            },
          })
            .then((resp) => resp.json())
            .then((res) => this.setState({ augmented_datasets: res.data }));
        });
    } else {
      window.location.href = "login";
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ open: !this.state.open });

    if (
      !this.state.experiment.dataset_name ||
      !this.state.experiment.dataset_id
    ) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }

    fetch("http://127.0.0.1:8000/solarflare/fn-dataset/set_info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
      body: JSON.stringify(this.state.experiment),
    })
      .then((resp) => resp.json())
      .then((res) => (window.location.href = "graph-generation"))
      .catch();
  };

  handleFileChange = (files) => {
    // Update chosen files
  };

  handleClose = () => {};

  handleChange = (event) => {
    let thenew = this.state.experiment;

    if (event.target.name === "Data") {
      let id = event.target.value.split("-")[0];
      let dataset = event.target.value.split("-")[1];

      thenew["data"] = event.target.value;
      thenew["dataset_id"] = id;
      this.setState({ experiment: thenew });

      if (dataset == "dataset") {
        thenew["dataset"] = "dataset";
        this.state.datasets.map(
          (row) =>
            row.id == this.state.experiment.data_id &&
            this.setState({ data_type: row.data_type })
        );
      } else if (dataset == "augmented_dataset") {
        thenew["dataset"] = "augmented_dataset";
        this.state.augmented_datasets.map(
          (row) =>
            row.id == this.state.experiment.data_id &&
            this.setState({ data_type: row.dataset.data_type })
        );
      }
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Data") {
      thenew["mvts_dataset_id"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Name") {
      thenew["dataset_name"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Description") {
      thenew["description"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Pearson") {
      thenew["pearson"] = parseFloat(event.target.value);
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
                    row.status == "completed" ? (
                      <MenuItem className="font" value={row.id + "-dataset"}>
                        {row.dataset_name}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        disabled
                        className="font"
                        value={row.id + "-dataset"}
                      >
                        {row.dataset_name}
                      </MenuItem>
                    )
                  )}
                  {this.state.augmented_datasets.length > 0 ? (
                    <Divider className="divider" />
                  ) : (
                    <></>
                  )}

                  {this.state.augmented_datasets.map((row) =>
                    row.status == "completed" ? (
                      <MenuItem
                        className="font"
                        value={row.id + "-augmented_dataset"}
                      >
                        {row.dataset_name}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        disabled
                        className="font"
                        value={row.id + "-augmented_dataset"}
                      >
                        {row.dataset_name}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText>Select one of your Datasets</FormHelperText>
              </FormControl>

              <Slider
                track="inverted"
                value={this.state.experiment.pearson}
                sx={{ mt: 5, mb: 1 }}
                aria-label="Pearson"
                name="Pearson"
                onChange={this.handleChange}
                defaultValue={0}
                valueLabelDisplay="auto"
                step={0.05}
                marks={marks}
                min={-1}
                max={1}
              />
              <FormHelperText sx={{ mt: 2 }}>
                Greater Than : {this.state.experiment.pearson}
              </FormHelperText>
              <FormHelperText sx={{ mt: 1, mb: 5 }}>
                Select the Pearson's Correlation Coefficient ( Between -1 and
                +1)
              </FormHelperText>

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
                  Please Wait. You will be redirected to the Graph Generation
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
