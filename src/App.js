import logo from './logo.svg';
import './App.css';

function App() {
  return (
<div class="sidebar">
  <div class="logo">Awesome<span>Portfolio</span></div>
  <nav>
    <a href="" class="nav-item">Home</a>
    <a href="" class="nav-item">About</a>
    <a href="" class="nav-item active">Portfolio</a>
    <a href="" class="nav-item">Contact</a>
  </nav>
</div>

<div class="main-content">
  <div class="portfolio">
    <div class="portfolio-item medium">one</div>
    <div class="portfolio-item large two">two</div>
    <div class="portfolio-item medium">three</div>
    <div class="portfolio-item small">four</div>
    <div class="portfolio-item tall">five</div>
    <div class="portfolio-item wide">six</div>
    <div class="portfolio-item wide">six</div>
    <div class="portfolio-item medium">one</div>
  </div>
</div>
  );
}

export default App;
