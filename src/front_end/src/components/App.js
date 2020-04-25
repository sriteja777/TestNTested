import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import createQuiz from './createQuiz'
import login from './login'
import registerUser from './register'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import register from "../registerServiceWorker";
import playQuiz, {play} from './playQuiz'
import dashboard from './dashboard'
import logout from './logout'
import home from './home'
class App extends Component {
    componentDidMount() {

    }
    render() {
        // return (
        {/*<div className="App">*/}
            {/*<header className="App-header">*/}
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
                {/*<h1 className="App-title">Welcome to React</h1>*/}
            {/*</header>*/}
            {/*<p className="App-intro">*/}
                {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
            {/*</p>*/}
        {/*</div>*/}
        return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={'/'}>Test and Tested</Link>
                </div>
                <ul className="nav navbar-nav">
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/createQuiz'}>Create Quiz</Link></li>
                    {/*{!sessionStorage.getItem("userData") &&*/}
                    {/*< li > < Link to={'/login'}>Login</Link></li>*/}
                    {/*}*/}
                    {/*{sessionStorage.getItem("userData") &&*/}
                        {/*< li > < Link to={'/logout'}>Logout</Link></li>*/}
                    {/*}*/}
                    <li><Link to={'/register'}>Register</Link></li>
                    <li><Link to={'/playQuiz'}>Play Quiz</Link></li>
                    <li><Link to={'/dashboard'}>Dashboard</Link></li>
                  {/*<li><Link to={'/EditPerson'}>Edit Person</Link></li>*/}
                  {/*<li><Link to={'/DeletePerson'}>Delete Person</Link></li>*/}
                  {/*<li><Link to={'/ViewPeople'}>View People</Link></li>*/}
                </ul>
              </div>
            </nav>
            <Switch>
                <Route exact path='/' component={home} />
                <Route exact path='/createQuiz' component={createQuiz} />
                <Route exact path='/login' component={login}/>
                <Route exact path='/register' component={registerUser}/>
                <Route exact path='/playQuiz' component={playQuiz}/>
                <Route exact path='/playQuiz/:quizId' component={play}/>
                <Route exact path='/dashboard/' component={dashboard}/>
                <Route exact path='/logout/' component={logout}/>
                {/*<Route exact path='/EditPerson' component={EditPerson} />*/}
                {/*<Route exact path='/DeletePerson' component={DeletePerson} />*/}
                {/*<Route exact path='/ViewPeople' component={ViewPeople} />*/}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;