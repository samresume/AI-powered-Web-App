import React, {Component} from 'react';
import {withCookies} from 'react-cookie'
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";


function preventDefault(event) {
  event.preventDefault();
}


class Orders extends Component {

  state = {
    project : {
      project_id: this.props.cookies.get('project-id'),
    },
    open : false,
    token : this.props.cookies.get('user-token'),

    apr: {
      accuracy: null,
      precision: null,
      recall: null,
    },

  }

  handleClickOpen = () => {
    this.setState({open : true});
  };


  handleClick = () => {
    console.info('You clicked the Chip.');
  };

  componentDidMount() {
    if (this.state.token){
      fetch(`http://127.0.0.1:8000/solarflare/project-result/get_info/`, {
        method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${this.state.token}`
          },
          body: JSON.stringify(this.state.project)
      }).then(resp => resp.json()).then(  res =>
          this.setState({apr : res.data})
      )
          .catch()
    } else {
      window.location.href = 'login';
    }

  }

  render() {
    return (
        <React.Fragment>
          <h2 className={'h2'}>ML Report</h2>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Stack className='space' direction="row" spacing={1}>
                <Typography className={'title'} variant="h6" component="h5">
                  {"Accuracy: " +this.state.apr.accuracy}
                </Typography>
              </Stack>
              <Stack className='space' direction="row" spacing={1}>
                <Typography className={'title'} variant="h6" component="h5">
                  {"Precision: " +this.state.apr.precision}
                </Typography>
              </Stack>
              <Stack className='space' direction="row" spacing={1}>
                <Typography className={'title'} variant="h6" component="h5">
                  {"Recall: " +this.state.apr.recall}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

        </React.Fragment>
    );
  }
}
export default withCookies(Orders);
