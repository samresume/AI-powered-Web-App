import './App.css';
import videoBg from './videoBg.mp4'
import logo from './logo.svg'
function About() {
  return (
    <div className='About'>
        <a href='/'><img className="logo-about" src={logo}></img></a>
        <h1 className="About-h"> About Us</h1>
        <p className="About-p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet purus ut ipsum efficitur rhoncus.
            Suspendisse et lacus volutpat, scelerisque enim in, bibendum nulla. Donec sodales rutrum libero,
            id facilisis risus tincidunt malesuada. Duis vitae tristique quam. Suspendisse potenti.
            Fusce lobortis turpis lectus, in ornare neque ullamcorper sit amet. Phasellus porttitor vel diam sit amet sodales.
            Vestibulum luctus turpis dui, quis imperdiet elit fringilla eu. Etiam euismod sagittis libero eu bibendum.
            Fusce sollicitudin, sapien vel dapibus ultrices, arcu eros semper lacus, quis facilisis sem ante et orci.
            Mauris quis accumsan arcu. Duis tincidunt finibus neque non molestie.
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Pellentesque eros ex, bibendum commodo volutpat eu, pulvinar sit amet libero.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris vel augue urna.
        </p>

    </div>
  );
}

export default About;
