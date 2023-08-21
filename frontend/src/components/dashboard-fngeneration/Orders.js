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
import FilePresentIcon from "@mui/icons-material/FilePresent";
import StraightenIcon from "@mui/icons-material/Straighten";
import LoadingButton from "@mui/lab/LoadingButton";
import DownloadIcon from "@mui/icons-material/Download";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Pagination from "@mui/material/Pagination";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import LabelIcon from "@mui/icons-material/Label";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";
import LabelTwoToneIcon from "@mui/icons-material/LabelTwoTone";
import ListItemIcon from "@mui/material/ListItemIcon";

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
      dataset_id: -1,
    },
    dataLoading: true,
    pagination_max: 1,
    pagination_current: 1,
    max_content: 10,
    content_count: 0,
    pagination_floor: 0,
    pagination_ceil: 1,
    anchorEl: null,
  };

  handleClickOpen = (id, e) => {
    this.setState({ open: true });

    let myid = this.state.delete;
    myid["dataset_id"] = id;
    this.setState({ delete: myid });
  };

  snackClose = () => {
    this.setState({ snackbar: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  downloadDataset = (id, e, which) => {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/fn-dataset/get_file/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        },
        body: JSON.stringify({ dataset_id: id, which: which }),
      })
        .then((resp) => {
          return Promise.all([
            resp.blob(),
            resp.headers.get("Content-Disposition"),
          ]);
        })
        .then(([blob, name]) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = String(name).split('"')[1];
          a.click();
        })
        .catch();
    } else {
    }
  };

  handleDelete = () => {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/fn-dataset/delete_dataset/", {
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

  handleClickMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  componentDidMount() {
    if (this.state.token) {
      fetch("http://127.0.0.1:8000/solarflare/fn-dataset/get_info", {
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
        <h2 className={"h2"}>Graph Generation</h2>
        <Fab
          className="fab"
          color="primary"
          variant="extended"
          size="medium"
          onClick={(event) => {
            window.location.href = "/new-graph";
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          New Graph Generation
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
                      {row.dataset_name}
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
                  {row.dataset_type == "dataset" ? (
                    row.mvts_dataset ? (
                      <>
                        <Stack className="space" direction="row" spacing={1}>
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              "Dataset Name: " + row.mvts_dataset.dataset_name
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
                              row.mvts_dataset.data_type === "mvts"
                                ? "Data Type: MVTS"
                                : "Data Type: Functional Network"
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              row.mvts_dataset.preprocessing === 1
                                ? "PreProcessed"
                                : row.mvts_dataset.preprocessing === 0
                                ? "Not PreProcessed"
                                : ""
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              row.mvts_dataset.znormalization === 1
                                ? "Normalized"
                                : "Not Normalized"
                            }
                          />
                        </Stack>
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
                  ) : row.dataset_type == "augmented_dataset" ? (
                    row.aug_dataset ? (
                      <>
                        <Stack className="space" direction="row" spacing={1}>
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={
                              "Dataset Name: " + row.aug_dataset.dataset_name
                            }
                          />
                          <Chip
                            className="datasetchip"
                            onClick={this.handleClick}
                            label={"Augmented Dataset"}
                          />
                          {row.aug_dataset.dataset ? (
                            <>
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.aug_dataset.dataset.data_type === "mvts"
                                    ? "Data Type: MVTS"
                                    : "Data Type: Functional Network"
                                }
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.aug_dataset.dataset.preprocessing === 1
                                    ? "PreProcessed"
                                    : row.aug_dataset.dataset.preprocessing ===
                                      0
                                    ? "Not PreProcessed"
                                    : ""
                                }
                              />
                              <Chip
                                className="datasetchip"
                                onClick={this.handleClick}
                                label={
                                  row.aug_dataset.dataset.znormalization === 1
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
                        </Stack>
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
                  <Stack className="space" direction="row" spacing={1}>
                    <Chip
                      className="mainchip"
                      onClick={this.handleClick}
                      label={
                        "Pearson's Correlation Coefficient: Greater Than " +
                        row.pearson
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
                  </Stack>

                  <Divider className="divider" />

                  {row.status == "completed" ? (
                    <>
                      <Stack className="space" direction="row" spacing={1}>
                        <Chip
                          size="small"
                          className="resultchip"
                          variant="outlined"
                          icon={<FilePresentIcon />}
                          label={"Dataset Name: '" + row.data[0].name + "'"}
                        />
                        <Chip
                          size="small"
                          className="resultchip"
                          variant="outlined"
                          icon={<StraightenIcon />}
                          label={"Dataset Size: '" + row.data[0].volume + "'"}
                        />
                      </Stack>
                      <Stack className="space" direction="row" spacing={1}>
                        <Chip
                          size="small"
                          className="resultchip"
                          variant="outlined"
                          icon={<FilePresentIcon />}
                          label={"Labels Name: '" + row.data[1].name + "'"}
                        />
                        <Chip
                          size="small"
                          className="resultchip"
                          variant="outlined"
                          icon={<StraightenIcon />}
                          label={"Labels Size: '" + row.data[1].volume + "'"}
                        />
                      </Stack>
                      <Stack className="space" direction="row" spacing={1}>
                        <Chip
                          size="small"
                          className="datechip"
                          icon={<AccessTimeIcon />}
                          label={
                            "Date Finished: " +
                            row.report_datetime.split("T")[0] +
                            " " +
                            row.report_datetime.split("T")[1].split(".")[0]
                          }
                        />
                      </Stack>
                    </>
                  ) : (
                    <></>
                  )}

                  <Stack
                    sx={{ pt: 3 }}
                    className="space"
                    direction="row"
                    spacing={5}
                  >
                    <LoadingButton
                      size="small"
                      color="success"
                      onClick={this.handleClickMenu}
                      loading={row.status == "completed" ? false : true}
                      loadingPosition="start"
                      startIcon={<DownloadIcon />}
                      variant="contained"
                    >
                      <span>Generated Dataset</span>
                    </LoadingButton>

                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.handleCloseMenu}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))",
                          mt: 1,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem
                        onClick={(e) => {
                          this.downloadDataset(row.id, e, "data");
                        }}
                      >
                        <ListItemIcon>
                          <FolderOpenTwoToneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Dataset</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          this.downloadDataset(row.id, e, "label");
                        }}
                      >
                        <ListItemIcon>
                          <LabelTwoToneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Labels</ListItemText>
                      </MenuItem>
                    </Menu>

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
                        disabled
                        size="small"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={(e) => this.handleClickOpen(row.id, e)}
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
              The data files will be deleted completely.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
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
            The dataset has been deleted successfully!
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}
export default withCookies(Orders);
