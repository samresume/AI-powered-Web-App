import './App.css';
import videoBg from './videoBg.mp4'
import logo from './logo.svg'
function Contact() {
  return (
    <div className='About'>
        <a href='/'><img className="logo-about" src={logo}></img></a>
        <h1 className="About-h"> Contact Us</h1>
        <p className="About-p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet purus ut ipsum efficitur rhoncus.
            Suspendisse et lacus volutpat, scelerisque enim in, bibendum nulla. Donec sodales rutrum libero,
            id facilisis risus tincidunt malesuada. Duis vitae tristique quam. Suspendisse potenti.
            Fusce lobortis turpis lectus, in ornare neque ullamcorper sit amet.
        </p>
        <h5>Email: tohamdi@gmail.com</h5>
        <h5>Address: Utah State University, Logan, Utah, U.S.</h5>
    </div>
  );
}

export default Contact;
