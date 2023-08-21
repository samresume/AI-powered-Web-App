import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import AlarmIcon from "@mui/icons-material/Alarm";
import EventIcon from "@mui/icons-material/Event";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { Class } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { withCookies } from "react-cookie";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import DownloadIcon from "@mui/icons-material/Download";
import LoadingButton from "@mui/lab/LoadingButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import StraightenIcon from "@mui/icons-material/Straighten";
import Pagination from "@mui/material/Pagination";

function preventDefault(event) {
  event.preventDefault();
}

class Orders extends Component {
  state = {
    experiments: [],
    open: false,
    snackbar: false,
    token: this.props.cookies.get("user-token"),
    delete: {
      project_id: -1,
    },
    pagination_max: 1,
    pagination_current: 1,
    max_content: 10,
    content_count: 0,
    pagination_floor: 0,
    pagination_ceil: 1,
  };

  handleClickOpen = (id, e) => {
    this.setState({ open: true });

    let myid = this.state.delete;
    myid["project_id"] = id;
    this.setState({ delete: myid });
  };

  snackClose = () => {
    this.setState({ snackbar: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  downloadDataset = (id, e) => {};

  handleDelete = () => {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/project/delete_project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        },
        body: JSON.stringify(this.state.delete),
      })
        .then((resp) => resp.json())
        .then((res) =>
          this.setState({ experiments: res.data, open: false, snackbar: true })
        )
        .catch();
    } else {
      this.setState({ open: false });
    }
  };

  handleClick = () => {
    console.info("You clicked the Chip.");
  };
  handlePagination = (event, value) => {
    this.setState({ pagination_current: value });

    this.setState({
      pagination_floor: (value - 1) * this.state.max_content,
    });
    this.setState({
      pagination_ceil: value * this.state.max_content + 1,
    });
  };

  componentDidMount() {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/project/get_projects", {
        method: "Get",
        headers: {
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((resp) => resp.json())
        .then((res) => {
          this.setState({
            experiments: res.data,
            content_count: res.data.length,
            pagination_max: Math.ceil(res.data.length / this.state.max_content),
          });
          this.setState({
            pagination_floor:
              (this.state.pagination_current - 1) * this.state.max_content,
          });
          this.setState({
            pagination_ceil:
              this.state.pagination_current * this.state.max_content + 1,
          });
        })
        .catch();
    } else {
      window.location.href = "login";
    }
  }

  render() {
    return (
      <React.Fragment>
        <h2 className={"h2"}>ML Sessions</h2>
        <Fab
          className="fab"
          color="primary"
          variant="extended"
          size="medium"
          onClick={(event) => {
            window.location.href = "/new-session";
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          New ML Session
        </Fab>
        {this.state.experiments.map((row, index) =>
          index > this.state.pagination_floor - 1 &&
          index < this.state.pagination_ceil - 1 ? (
            <Grid key={row.id} item xs={12}>
              <Accordion
                sx={{ p: 2, display: "flex", flexDirection: "column" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Stack className="space" direction="row" spacing={1}>
                    <Typography className={"title"} variant="h6" component="h5">
                      {row.project_name}
                    </Typography>
                    <Typography
                      variant="overline"
                      className={
                        row.status === "completed"
                          ? "green margin"
                          : "blue margin"
                      }
                    >
                      ({row.status})
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack className="space" direction="row" spacing={1}>
                    <Typography
                      className={"description"}
                      variant="p"
                      component="p"
                    >
                      {row.description}
                    </Typography>
                  </Stack>
                  <Stack className="space" direction="row" spacing={1}>
                    {row.dataset_type == "dataset" ? (
                      row.data_info ? (
                        <>
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              "Dataset Name: " + row.data_info.dataset_name
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={"Uploaded dataset"}
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              row.data_info.data_type === "mvts"
                                ? "Data Type: MVTS"
                                : "Data Type: Functional Network"
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              row.data_info.preprocessing === 1
                                ? "PreProcessed"
                                : row.data_info.preprocessing === 0
                                ? "Not PreProcessed"
                                : ""
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              row.data_info.znormalization === 1
                                ? "Normalized"
                                : "Not Normalized"
                            }
                          />
                        </>
                      ) : (
                        <Stack className="space" direction="row" spacing={1}>
                          <Chip
                            className="errorchip"
                            onClick={this.handleClick}
                            label={"You have deleted the refrence dataset"}
                          />
                        </Stack>
                      )
                    ) : (
                      <></>
                    )}
                    {row.dataset_type == "fn_dataset" ? (
                      row.fn_data_info ? (
                        <>
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              "Dataset Name: " + row.fn_data_info.dataset_name
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={"Generated Graph Dataset"}
                          />
                          {row.fn_data_info.dataset_type == "dataset" &&
                          row.fn_data_info.mvts_dataset ? (
                            <>
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={"Data Type: Functional Network"}
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.fn_data_info.mvts_dataset
                                    .preprocessing === 1
                                    ? "PreProcessed"
                                    : row.fn_data_info.mvts_dataset
                                        .preprocessing === 0
                                    ? "Not PreProcessed"
                                    : ""
                                }
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.fn_data_info.mvts_dataset
                                    .znormalization === 1
                                    ? "Normalized"
                                    : "Not Normalized"
                                }
                              />
                            </>
                          ) : row.fn_data_info.dataset_type == "dataset" &&
                            row.fn_data_info.mvts_dataset == null ? (
                            <Stack
                              className="space"
                              direction="row"
                              spacing={1}
                            >
                              <Chip
                                className="errorchip"
                                onClick={this.handleClick}
                                label={"You have deleted the refrence dataset"}
                              />
                            </Stack>
                          ) : (
                            <></>
                          )}
                          {row.fn_data_info.dataset_type ==
                            "augmented_dataset" &&
                          row.fn_data_info.aug_dataset ? (
                            <>
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={"Augmented Dataset"}
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={"Data Type: Functional Network"}
                              />
                              {row.fn_data_info.aug_dataset.dataset ? (
                                <>
                                  <Chip
                                    className="datasetchip"
                                    onClick={this.handleClick}
                                    label={
                                      row.fn_data_info.aug_dataset.dataset
                                        .preprocessing === 1
                                        ? "PreProcessed"
                                        : row.fn_data_info.aug_dataset.dataset
                                            .preprocessing === 0
                                        ? "Not PreProcessed"
                                        : ""
                                    }
                                  />
                                  <Chip
                                    className="datasetchip"
                                    onClick={this.handleClick}
                                    label={
                                      row.fn_data_info.aug_dataset.dataset
                                        .znormalization === 1
                                        ? "Normalized"
                                        : "Not Normalized"
                                    }
                                  />
                                </>
                              ) : row.fn_data_info.aug_dataset.dataset ==
                                null ? (
                                <Stack
                                  className="space"
                                  direction="row"
                                  spacing={1}
                                >
                                  <Chip
                                    className="errorchip"
                                    onClick={this.handleClick}
                                    label={
                                      "You have deleted the refrence dataset"
                                    }
                                  />
                                </Stack>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : row.fn_data_info.dataset_type ==
                              "augmented_dataset" &&
                            row.fn_data_info.aug_dataset == null ? (
                            <Stack
                              className="space"
                              direction="row"
                              spacing={1}
                            >
                              <Chip
                                className="errorchip"
                                onClick={this.handleClick}
                                label={"You have deleted the refrence dataset"}
                              />
                            </Stack>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <Stack className="space" direction="row" spacing={1}>
                          <Chip
                            className="errorchip"
                            onClick={this.handleClick}
                            label={"You have deleted the refrence dataset"}
                          />
                        </Stack>
                      )
                    ) : (
                      <></>
                    )}
                    {row.dataset_type == "augmented_dataset" ? (
                      row.data_aug_info ? (
                        <>
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              "Dataset Name: " + row.data_aug_info.dataset_name
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={"Augmented Dataset"}
                          />
                          {row.data_aug_info.dataset ? (
                            <>
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.data_aug_info.dataset.data_type === "mvts"
                                    ? "Data Type: MVTS"
                                    : "Data Type: Functional Network"
                                }
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.data_aug_info.dataset.preprocessing === 1
                                    ? "PreProcessed"
                                    : row.data_aug_info.dataset
                                        .preprocessing === 0
                                    ? "Not PreProcessed"
                                    : ""
                                }
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.data_aug_info.dataset.znormalization === 1
                                    ? "Normalized"
                                    : "Not Normalized"
                                }
                              />
                            </>
                          ) : (
                            <Stack
                              className="space"
                              direction="row"
                              spacing={1}
                            >
                              <Chip
                                className="errorchip"
                                onClick={this.handleClick}
                                label={"You have deleted the refrence dataset"}
                              />
                            </Stack>
                          )}
                        </>
                      ) : (
                        <Stack className="space" direction="row" spacing={1}>
                          <Chip
                            className="errorchip"
                            onClick={this.handleClick}
                            label={"You have deleted the refrence dataset"}
                          />
                        </Stack>
                      )
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Stack className="space" direction="row" spacing={1}>
                    <Chip
                      className="mainchip"
                      onClick={this.handleClick}
                      label={
                        row.project_info.task === "unsupervised"
                          ? "Task: UnSupervised"
                          : "Task: Supervised"
                      }
                    />
                    <Chip
                      className="mainchip"
                      onClick={this.handleClick}
                      label={
                        row.project_info.learning_type === "regression"
                          ? "Learning Type: Regression"
                          : row.project_info.learning_type === "classification"
                          ? "Learning Type: Classification"
                          : "Learning Type: Clustering"
                      }
                    />
                    <Chip
                      className="mainchip"
                      onClick={this.handleClick}
                      label={
                        row.project_info.ml_model === "gru"
                          ? "ML Model: GRU"
                          : row.project_info.ml_model === "rnn"
                          ? "ML Model: RNN"
                          : row.project_info.ml_model === "lstm"
                          ? "ML Model: LSTM"
                          : row.project_info.ml_model === "rocket"
                          ? "ML Model: ROCKET"
                          : row.project_info.ml_model === "sfc"
                          ? "ML Model: Statistical Feature Computation"
                          : row.project_info.ml_model === "le"
                          ? "ML Model: Laplacian Eigenmaps"
                          : row.project_info.ml_model === "node2vec"
                          ? "ML Model: node2vec"
                          : "ML Model: GCN"
                      }
                    />
                  </Stack>
                  <Stack className="space" direction="row" spacing={1}>
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={
                        row.project_info.optimization === "gradientdescent"
                          ? "Optimization Algorithm: Gradient Descent"
                          : row.project_info.optimization === "adam"
                          ? "Optimization Algorithm: Adam Optimizer"
                          : " Optimization Algorithm: null"
                      }
                    />
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={
                        row.project_info.activation_func === "sigmoid"
                          ? "Activation Function: Sigmoid"
                          : row.project_info.activation_func === "relu"
                          ? "Activation Function: ReLU"
                          : row.project_info.activation_func === "tanh"
                          ? "Activation Function: Tanh"
                          : "Activation Function: null"
                      }
                    />
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={
                        "Learning Rate : " + row.project_info.learning_rate
                      }
                    />
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={"Layers : " + row.project_info.layers}
                    />
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={"Epochs : " + row.project_info.epochs}
                    />
                    <Chip
                      size="small"
                      className="hyperchip"
                      onClick={this.handleClick}
                      variant="outlined"
                      label={
                        "Train Test Split : " +
                        row.project_info.train_split +
                        "%"
                      }
                    />
                  </Stack>

                  <Stack className="space" direction="row" spacing={1}>
                    <Chip
                      size="small"
                      className="datechip"
                      icon={<AccessTimeIcon />}
                      label={
                        "Date Created: " +
                        row.datetime.split("T")[0] +
                        " " +
                        row.datetime.split("T")[1].split(".")[0]
                      }
                    />
                    {row.status === "completed" ? (
                      <Chip
                        size="small"
                        className="datechip"
                        icon={<AccessAlarmIcon />}
                        label={
                          "Date Finished: " +
                          row.report_datetime.split("T")[0] +
                          " " +
                          row.report_datetime.split("T")[1].split(".")[0]
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Divider className="divider" />
                  <Stack className="space" direction="row" spacing={1}>
                    {row.status === "completed" ? (
                      <>
                        <Chip
                          className="accuracychip"
                          icon={<CelebrationIcon />}
                          label={"Accuracy: " + row.project_result.accuracy}
                        />
                        <Chip
                          className="accuracychip"
                          icon={<CelebrationIcon />}
                          label={"Precision: " + row.project_result.precision}
                        />
                        <Chip
                          className="accuracychip"
                          icon={<CelebrationIcon />}
                          label={"Recall: " + row.project_result.recall}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Stack
                    sx={{ pt: 3 }}
                    className="space"
                    direction="row"
                    spacing={5}
                  >
                    {row.status === "completed" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color={"secondary"}
                        onClick={(event) => {
                          this.props.cookies.set("project-id", row.id);
                          window.location.href = "/ml-report";
                        }}
                      >
                        Show Full Report
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color={"secondary"}
                        disabled
                      >
                        Show Full Report
                      </Button>
                    )}
                    {row.status === "completed" ? (
                      <LoadingButton
                        size="small"
                        color="success"
                        onClick={(e) => this.downloadDataset(row.id, e)}
                        loading={this.state.dataLoading}
                        loadingPosition="start"
                        startIcon={<DownloadIcon />}
                        variant="contained"
                      >
                        <span>Download the Report</span>
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        size="small"
                        color="success"
                        onClick={(e) => this.downloadDataset(row.id, e)}
                        loading={this.state.dataLoading}
                        loadingPosition="start"
                        startIcon={<DownloadIcon />}
                        variant="contained"
                        disabled
                      >
                        <span>Download the Report</span>
                      </LoadingButton>
                    )}
                    {row.status === "completed" ? (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={(e) => this.handleClickOpen(row.id, e)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={(e) => this.handleClickOpen(row.id, e)}
                        disabled
                      >
                        Delete
                      </Button>
                    )}
                  </Stack>
                  {row.status !== "completed" && (
                    <LinearProgress className="progress-bar" />
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          ) : (
            <></>
          )
        )}
        <Grid sx={{ mt: 5 }} item xs={12}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <Pagination
              count={this.state.pagination_max}
              defaultPage={1}
              page={this.state.pagination_current}
              onChange={this.handlePagination}
              variant="outlined"
              size="large"
              color="secondary"
            />
          </Stack>
        </Grid>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to delete the experiment?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              All of the data that is related to this experiment will be
              deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color={"success"} onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color={"error"} onClick={this.handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.snackbar}
          autoHideDuration={6000}
          onClose={this.snackClose}
        >
          <Alert
            onClose={this.snackClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            The session has been deleted successfully!
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}
export default withCookies(Orders);
