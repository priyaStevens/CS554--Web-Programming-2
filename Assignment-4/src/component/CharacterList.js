import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import noImage from '../img/download.jpeg';
import { Link } from 'react-router-dom';
import SearchComponent from  './SearchComponent';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles,Button } from '@material-ui/core';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
		Color: 'black !important'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	},
	buttonclass:{
		marginleft:'.5%',
		marginRight:'.5%',
		backgroundColor:'black'
	}
});

const CharacterList = (props) => {
	const [characterData, setCharacterListData] = useState(undefined);
	const classes = useStyles();
	const [hasError, setHasError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [error, setError] = useState('');
	
	let card = null;

	let currentPage  =  0;
	
	if (props.match.params.page === undefined){
		if(currentPage == null){
		currentPage =0;}
	}
	else{
		currentPage = (parseInt(props.match.params.page));
	}
    const md5 = require('blueimp-md5');
    const publickey = '95c1744620cf92c396f0972b69ca790f';
    const privatekey = 'c4a2db946acd4f1785d3761f220bbb93ed8608a7';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
	const hash = md5(stringToHash);
	const offset = parseInt(100*currentPage)+1;
	const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?';
    // const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?limit=100';
	// const url = baseUrl + '&offset=' + offset + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

	const useAxios =(baseUrl) =>{
		const [state, setState] = useState({ data: null});

	useEffect(async() => {
		setLoading(true);
		if(!Number.isNaN(offset)){
		let url = baseUrl + 'limit=100' +'&offset=' + offset + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        await axios.get(url).then(
            ({data}) => {
				setCharacterListData(data.data.results);
				setState({ data: data.data.results });
				setSearchData(undefined);
				setLoading(false);
				setHasError(false);
			}
        ).catch(err => {
			setError(err.message);
			setHasError(true);
			setLoading(false);});
	}else{
		setHasError(true);
		setLoading(false);
	}}, [currentPage]);

	useEffect(async() => {
		let url = null;
		if(searchTerm){
		url  = baseUrl + 'nameStartsWith=' + searchTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
		
        setLoading(true)
        await axios.get(url).then(
            ({data}) => {
				setState({data: data.data.results});
				setSearchData(data.data.results);
				if(data.data.results.length>0){
					setHasError(false);
				}
				else{
					setHasError(true);
				}
				setLoading(false);
				// setHasError(false);
			}
        ).catch(err => {
			setSearchData('');
			setError(err.message);
			setHasError(true);
			setLoading(false);});
			
			
	}}, [searchTerm]);


	return state
};


   let { CharacterListData} = useAxios(baseUrl);

   const searchValue = async (value) => {
	setSearchTerm(value);
};


	const buildCard = (listData) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={listData.id}>
				<Card className={classes.card} variant='outlined'>
						<CardActionArea>
						   <Link key={listData.id} to={`/characters/${listData.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={listData.thumbnail && listData.thumbnail.path + '.' + listData.thumbnail.extension ? listData.thumbnail.path + '.' + listData.thumbnail.extension: noImage}
								title='show image'
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{listData.name}
								</Typography>
							</CardContent>
							</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if(searchTerm){
		card =
		searchData &&
		searchData.map((listData) => {
				return buildCard(listData);
			});
	}

	else{
		card =
		characterData &&
		characterData.map((listData) => {
				return buildCard(listData);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else{
		if(hasError){
			return(
			<div>
			<div>
				<SearchComponent searchValue={searchValue} searchTerm = {searchTerm} />
			</div>
			<div>
			<h2>No result found!!</h2>
			<h3>{error}</h3>
			</div>
			</div>
			)
		}else{
		return(
			<div>
			<div>
				<SearchComponent searchValue={searchValue} searchTerm = {searchTerm} />
			</div>
			<br/>
			<br/>
			<div>

			{!searchTerm && currentPage > 0 ?(<Link className='showlink' to={`/characters/page/`+(parseInt(currentPage)-1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Previous</Button></Link>) : ''}

			{!searchTerm && characterData && characterData.length >= 100 ?(<Link className='showlink' to={`/characters/page/`+(parseInt(currentPage)+1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Next</Button></Link>) : ''}

				
			{searchData && searchData.length >= 100 ?(<Link className='showlink' to={`/series/page/`+(parseInt(currentPage)+1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Next</Button></Link>) : ''}

			</div>
			<br />
			<br />
			<Grid container className={classes.grid} spacing={5}>
				{card}
		    </Grid>
		</div>
		)}}
};

export default CharacterList;