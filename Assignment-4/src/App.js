import React from 'react';
import './App.css';
import logo from './img/marvel-logo.png';
import CharacterList from './component/CharacterList';
import ComicsList from './component/ComicsList';
import Home from './component/Home';
import SeriesList from './component/SeriesList';
import Character from './component/Character';
import Comics from './component/Comics'; 
import Series from './component/Series';
import Error from './component/ErrorComponent';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// import { Switch } from '@material-ui/core';

const App = () => {

	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to the React.js Marvel API Example</h1>
					<Link key='home' className='showlink' to='/'>
						Home
					</Link>
					<Link key='characters' className='showlink' to='/characters/page/0'>
                      Characters
					</Link>
					<Link key='comics' className='showlink' to='/comics/page/0'>
                      Comics
					</Link>
					<Link key='series' className='showlink' to='/series/page/0'>
                      Series
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
				<Switch>
					<Route  path = '/' exact component={Home} />
					<Route  path = '/characters/page/:page'  exact component={CharacterList} />
					<Route  path = '/characters/:id'  exact component={Character} />
					<Route  path = '/comics/page/:page'  exact component={ComicsList} />
					<Route  path =  '/comics/:id'  exact component={Comics} />
					<Route  path= '/series/page/:page'  exact component={SeriesList} />	
					<Route  path = '/series/:id'  exact component={Series} />	
					<Route  path = '*' exact component={Error} status={404}/>
					</Switch>

			
				</div>
			</div>
		</Router>
	);
};

export default App;