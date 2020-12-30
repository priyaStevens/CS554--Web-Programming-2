import React from 'react';
import '../App.css';

const Home = () => {
	return (
		<div>
			<p>
				This is a simple example of using React to Query the Marvel API. It has option to display Marvel Characters, Marvel Series and Mervel comics by clicking on different buttons.
			</p>

			<p className='hometext'>
				The Application queries to Marvel Caharcters for getting character data.
				<a rel='character' target = '_blank' href='https://developer.marvel.com/' >
				https://gateway.marvel.com:443/v1/public/characters
				</a>{' '}
			</p>
			<p>
				The Application queries to Marvel Comics for getting comice data.
				<a rel='comics' target = '_blank' href='https://developer.marvel.com/' >
				https://gateway.marvel.com:443/v1/public/comics
				</a>{' '}
			</p>
			<p>
				The Application queries to Marvel Series for getting series data.
				<a rel='series' target = '_blank' href='https://developer.marvel.com/' >
				https://gateway.marvel.com:443/v1/public/series
				</a>{' '}
			</p>
		</div>
	);
};

export default Home;
