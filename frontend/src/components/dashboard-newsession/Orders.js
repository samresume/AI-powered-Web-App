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
class Orders extends Component {
  state = {
    open: false,
    token: this.props.cookies.get("user-token"),
    captchaResult: "",
    datasets: [],
    fn_datasets: [],
    augmented_datasets: [],
    data_type: null,
    isRequired: false,
    experiment: {
      project_name: "",
      description: "",
      status: "running",

      data: null,
      data_id: null,
      dataset: null,

      normalize: 1,
      data_augmentation: "",

      task: "",
      learning_type: "",
      ml_model: "",

      learning_rate: 0,
      optimization: "",
      activation_func: "",
      layers: 0,
      epochs: 0,
      train_split: 0,
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
          fetch("http://127.0.0.1:8000/solarflare/fn-dataset/get_info", {
            method: "Get",
            headers: {
              Authorization: `Token ${this.state.token}`,
            },
          })
            .then((resp) => resp.json())
            .then((res) => {
              this.setState({ fn_datasets: res.data });
              fetch(
                "http://127.0.0.1:8000/solarflare/augmented-dataset/get_info",
                {
                  method: "Get",
                  headers: {
                    Authorization: `Token ${this.state.token}`,
                  },
                }
              )
                .then((resp) => resp.json())
                .then((res) => this.setState({ augmented_datasets: res.data }));
            });
        });
    } else {
      window.location.href = "login";
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ open: !this.state.open });

    if (
      !this.state.experiment.project_name ||
      !this.state.experiment.data_id ||
      !this.state.experiment.task ||
      !this.state.experiment.learning_type ||
      !this.state.experiment.ml_model
    ) {
      this.setState({ open: false });
      this.setState({ isRequired: true });
      return;
    }

    fetch("http://127.0.0.1:8000/solarflare/project/set_project/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
      body: JSON.stringify(this.state.experiment),
    })
      .then((resp) => resp.json())
      .then((res) => (window.location.href = "ml-sessions"))
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
      thenew["data_id"] = id;
      this.setState({ experiment: thenew });

      if (dataset == "dataset") {
        thenew["dataset"] = "dataset";
        this.state.datasets.map(
          (row) =>
            row.id == this.state.experiment.data_id &&
            this.setState({ data_type: row.data_type })
        );
        console.log(this.state.data_type);
      } else if (dataset == "fn_dataset") {
        thenew["dataset"] = "fn_dataset";
        this.state.fn_datasets.map(
          (row) =>
            row.id == this.state.experiment.data_id &&
            this.setState({ data_type: "fn" })
        );
        console.log(this.state.data_type);
      } else if (dataset == "augmented_dataset") {
        thenew["dataset"] = "augmented_dataset";
        this.state.augmented_datasets.map(
          (row) =>
            row.id == this.state.experiment.data_id &&
            this.setState({ data_type: row.dataset.data_type })
        );
        console.log(this.state.data_type);
      }
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Task") {
      thenew["task"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Learning Type") {
      thenew["learning_type"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Ml Model") {
      thenew["ml_model"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Rate") {
      thenew["learning_rate"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Optimization") {
      thenew["optimization"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Activation") {
      thenew["activation_func"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Layers") {
      thenew["layers"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Epochs") {
      thenew["epochs"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Split") {
      thenew["train_split"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Name") {
      thenew["project_name"] = event.target.value;
      this.setState({ experiment: thenew });
    } else if (event.target.name === "Description") {
      thenew["description"] = event.target.value;
      this.setState({ experiment: thenew });
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <h2 className={"h2"}>New Session</h2>
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
              <Typography className="section" variant="h6" component="h6">
                Part 1: Data Selection
              </Typography>
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
                  {this.state.fn_datasets.length > 0 ? (
                    <Divider className="divider" />
                  ) : (
                    <></>
                  )}
                  {this.state.fn_datasets.map((row) =>
                    row.status == "completed" ? (
                      <MenuItem className="font" value={row.id + "-fn_dataset"}>
                        {row.dataset_name}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        disabled
                        className="font"
                        value={row.id + "-fn_dataset"}
                      >
                        {row.dataset_name}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText>Select one of your Datasets</FormHelperText>
              </FormControl>

              <Slider
                value={this.state.experiment.train_split}
                className="space"
                aria-label="Train Test Split"
                name="Split"
                onChange={this.handleChange}
                defaultValue={80}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={50}
                max={90}
              />
              <FormHelperText>Select the Train Split (50 to 90)</FormHelperText>

              <Typography className="section" variant="h6" component="h6">
                Part 2: Task Selection
              </Typography>
              <FormControl required className="space" fullWidth>
                <InputLabel className="font">Task</InputLabel>
                <Select
                  value={this.state.experiment.task}
                  label="Task"
                  name="Task"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="font" value={"supervised"}>
                    Supervised
                  </MenuItem>
                  <MenuItem className="font" value={"unsupervised"}>
                    UnSupervised
                  </MenuItem>
                </Select>
                <FormHelperText>Select the Task</FormHelperText>
              </FormControl>
              {this.state.experiment.task === "supervised" ? (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Learning Type</InputLabel>
                  <Select
                    value={this.state.experiment.learning_type}
                    label="Learning Type"
                    name="Learning Type"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem className="font" value={"classification"}>
                      Classification
                    </MenuItem>
                    <MenuItem className="font" value={"regression"}>
                      Regression
                    </MenuItem>
                  </Select>
                  <FormHelperText>Select the Learning Type</FormHelperText>
                </FormControl>
              ) : (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Learning Type</InputLabel>
                  <Select
                    value={this.state.experiment.learning_type}
                    label="Learning Type"
                    name="Learning Type"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem className="font" value={"clustering"}>
                      Clustering
                    </MenuItem>
                  </Select>
                  <FormHelperText>Select the Learning Type</FormHelperText>
                </FormControl>
              )}
              {this.state.experiment.task === "unsupervised" ? (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Ml Model</InputLabel>
                  <Select
                    value={this.state.experiment.ml_model}
                    label="Ml Model"
                    name="Ml Model"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the Machine Learning Model
                  </FormHelperText>
                </FormControl>
              ) : (this.state.experiment.task === "supervised") &
                (this.state.data_type == "mvts") ? (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Ml Model</InputLabel>
                  <Select
                    value={this.state.experiment.ml_model}
                    label="Ml Model"
                    name="Ml Model"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem className="font" value={"rocket"}>
                      ROCKET
                    </MenuItem>
                    <MenuItem className="font" value={"lstm"}>
                      LSTM
                    </MenuItem>
                    <MenuItem className="font" value={"gru"}>
                      GRU
                    </MenuItem>
                    <MenuItem className="font" value={"rnn"}>
                      RNN
                    </MenuItem>
                    <MenuItem className="font" value={"sfc"}>
                      Statistical Feature Computation
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the Machine Learning Model
                  </FormHelperText>
                </FormControl>
              ) : (this.state.experiment.task === "supervised") &
                (this.state.data_type == "fn") ? (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Ml Model</InputLabel>
                  <Select
                    value={this.state.experiment.ml_model}
                    label="Ml Model"
                    name="Ml Model"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem className="font" value={"le"}>
                      Laplacian Eigenmaps
                    </MenuItem>
                    <MenuItem className="font" value={"node2vec"}>
                      node2vec
                    </MenuItem>
                    <MenuItem className="font" value={"gcn"}>
                      GCN
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the Machine Learning Model
                  </FormHelperText>
                </FormControl>
              ) : (
                <FormControl required className="space" fullWidth>
                  <InputLabel className="font">Ml Model</InputLabel>
                  <Select
                    value={this.state.experiment.ml_model}
                    label="Ml Model"
                    name="Ml Model"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the Machine Learning Model
                  </FormHelperText>
                </FormControl>
              )}

              <Typography className="section" variant="h6" component="h6">
                Part 3: Hyperparameter Selection
              </Typography>

              <Slider
                value={this.state.experiment.learning_rate}
                className="space"
                aria-label="Rate"
                name="Rate"
                onChange={this.handleChange}
                defaultValue={1}
                valueLabelDisplay="auto"
                step={0.05}
                marks
                min={0}
                max={1}
              />
              <FormHelperText>Select the Learning Rate</FormHelperText>

              <FormControl required className="space" fullWidth>
                <InputLabel className="font">Optimization Algorithm</InputLabel>
                <Select
                  value={this.state.experiment.optimization}
                  label="Optimization Algorithm"
                  name="Optimization"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="font" value={"gradientdescent"}>
                    Gradient Descent
                  </MenuItem>
                  <MenuItem className="font" value={"adam"}>
                    Adam Optimizer
                  </MenuItem>
                </Select>
                <FormHelperText>
                  Select the Optimization Algorithm
                </FormHelperText>
              </FormControl>

              <FormControl required className="space" fullWidth>
                <InputLabel className="font">Activation Function</InputLabel>
                <Select
                  value={this.state.experiment.activation_func}
                  label="Activation Function"
                  name="Activation"
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="font" value={"sigmoid"}>
                    Sigmoid
                  </MenuItem>
                  <MenuItem className="font" value={"relu"}>
                    ReLU
                  </MenuItem>
                  <MenuItem className="font" value={"tanh"}>
                    Tanh
                  </MenuItem>
                </Select>
                <FormHelperText>Select the Activation Function</FormHelperText>
              </FormControl>

              <Slider
                value={this.state.experiment.layers}
                className="space"
                aria-label="Layers"
                name="Layers"
                onChange={this.handleChange}
                defaultValue={1}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
              />
              <FormHelperText>Select the Number of Layers</FormHelperText>

              <Slider
                value={this.state.experiment.epochs}
                className="space"
                aria-label="Epochs"
                name="Epochs"
                onChange={this.handleChange}
                defaultValue={1}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
              />
              <FormHelperText>Select the Number of Epochs</FormHelperText>

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
                    Create New ML Session
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
                    Create New ML Session
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
                  Please Wait. You will be redirected to the Sessions Page
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
