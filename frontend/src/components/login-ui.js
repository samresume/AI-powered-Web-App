import React, {Component} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {withCookies} from 'react-cookie'
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../logo.svg";
import {grey, orange, red} from "@mui/material/colors";
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';




const font =  "'Assistant', sans-serif";


const theme = createTheme({
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontSize: 12,
        fontFamily: font
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
class LoginUi extends Component {

    state = {
        credentials : {
            username : '',
            password : '',
        },
        wrong: false,
        captchaResult: '',
        cookieduration: false,
        token : this.props.cookies.get('user-token'),
    }

    handleRecaptcha = (value) => {
        fetch('http://127.0.0.1:8000/recaptcha/', {
            method: 'POST',
            body: JSON.stringify({ 'captcha_value': value }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.captcha.success)
                this.setState({captchaResult : data.captcha.success})
            })

    };

    handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://127.0.0.1:8000/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.credentials)
        }).then(resp => resp.json()).then( res =>{
            if (res.token) {
                if (this.state.cookieduration == true){
                    this.props.cookies.set('user-token', res.token, {
                        maxAge: 604800 // Will expire after 7 days (value is in number of sec.)
                    });
                } else {
                    this.props.cookies.set('user-token', res.token, {
                        maxAge: 43200 // Will expire after 12hr (value is in number of sec.)
                    });
                }
                window.location.href = "/dashboard";
                this.setState({wrong : false})
            } else {
                this.setState({wrong : true})
            }

        })
            .catch()
    };

    inputChanged = event => {
        if (event.target.name == 'duration'){
            let value = event.target.checked
            this.setState({cookieduration : value})
        } else {
            let cred = this.state.credentials;
            cred[event.target.name] = event.target.value;
            this.setState({credentials : cred})
        }
    }

    onGoogleLoginSuccess = event => {

    }

    onGoogleLoginFailure = event => {

    }

    componentDidMount() {
        if (this.state.token){
            window.location.href = '/dashboard';
        } else {

        }

    }

    render (){
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <a href='/'><img className="logo-login" src={logo}></img></a>
                        <Typography component="h1" variant="h4">
                            Log In
                        </Typography>
                        
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 5 }}>
                            <Grid container spacing={2} sx={{maxWidth: '350px'}}>
                                <Grid item xs={12}>
                                    <TextField
                                
                                        theme={theme}
                                        value={this.state.credentials.username}
                                        onChange={this.inputChanged}
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="username"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                        
                                    theme={theme}
                                    value={this.state.credentials.password}
                                    onChange={this.inputChanged}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        theme={theme}
                                        control={<Checkbox checked={this.state.cookieduration} onChange={this.inputChanged} color="primary" />}
                                        label="Remember me"
                                        name="duration"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                <div className="cta">
                                    <ReCAPTCHA
                                        sitekey="6LeJXKgmAAAAAPF5d3lOMAL8pwypyz_0omAu7zUw"
                                        onChange={this.handleRecaptcha}
                                    />
                                    {
                                        this.state.captchaResult ?
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Log In
                                        </Button>
                                            :
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            disabled
                                        >
                                            Log In
                                        </Button>
                                    }
                                </div>
                                </Grid>

                                <Grid item xs={12}>
                                <GoogleOAuthProvider clientId="73774722715-79ab6gmqg2l9bfhupqnqo53mm51ssg0b.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={this.onGoogleLoginSuccess}
                                        onFailure={this.onGoogleLoginFailure}
                                    />
                                </GoogleOAuthProvider>
                                </Grid>

                                <Grid item xs={12}>
                                <Grid container>
                                    <Grid className={'incorrect'} item sx={{ mt: 3, mb: 2 }}>
                                        <p href="#" variant="body2">
                                            {this.state.wrong === true ? "The username or password is incorrect!"
                                            : ""}
                                        </p>
                                    </Grid>
                                </Grid>
                                </Grid>
                                
                                <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item className="bottom">
                                        <Link href="signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                    </Grid>
                                </Grid>
                                    
                                
                        
                                
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        )
    }

}
export default withCookies(LoginUi);
