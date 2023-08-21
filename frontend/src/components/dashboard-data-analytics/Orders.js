import React, { Component } from "react";
import { withCookies } from "react-cookie";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";

function preventDefault(event) {
  event.preventDefault();
}

class Orders extends Component {
  state = {
    project: {
      dataaug_id: this.props.cookies.get("augmented-id"),
    },
    open: false,
    token: this.props.cookies.get("user-token"),

    apr: {
      accuracy: null,
      precision: null,
      recall: null,
    },
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClick = () => {
    console.info("You clicked the Chip.");
  };

  componentDidMount() {
    if (this.state.token) {
      fetch(`http://127.0.0.1:8000/solarflare/augmented-result/get_info/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        },
        body: JSON.stringify(this.state.project),
      })
        .then((resp) => resp.json())
        .then((res) => this.setState({ apr: res.data }))
        .catch();
    } else {
      window.location.href = "login";
    }
  }

  render() {
    return (
      <React.Fragment>
        <h2 className={"h2"}>Data Analysis</h2>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["group A", "group B", "group C", "group D", "group E"],
                },
              ]}
              series={[{ data: [400, 3000, 5000, 2000, 2500] }]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}
export default withCookies(Orders);
