import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import noImage from '../img/download.jpeg';
import SearchComponent from  './SearchComponent';
import { Link } from 'react-router-dom';
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
		color:'black'
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

const SeriesList = (props) => {
	const classes = useStyles();
	const [seriesData, setSeriesData] = useState('');
	const [hasError, setHasError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [error, setError] = useState('');
    
	let currentPage = null;
    if (props.match.params.page === undefined){
        if(currentPage == null){
		currentPage =0;}
    }
    else{
        currentPage = (parseInt(props.match.params.page));
    }
	let card = null;

    const md5 = require('blueimp-md5');
    const publickey = '95c1744620cf92c396f0972b69ca790f';
    const privatekey = 'c4a2db946acd4f1785d3761f220bbb93ed8608a7';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
	const hash = md5(stringToHash);
	const offset = parseInt(100*currentPage)+1;
	const baseurl = 'https://gateway.marvel.com:443/v1/public/series?'

	const useAxios =(baseUrl) =>{
		const [state, setState] = useState({ data: null});

	useEffect(async() => {
		setLoading(true);
		if(!Number.isNaN(offset)){
		let url  = baseUrl + '&limit=100'+'&offset=' + offset+ '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        await axios.get(url).then(
            ({data}) => {
				setSeriesData(data.data.results);
				setState({ data: data.data.results });
				setSearchTerm('');
				setSearchData('');
				setLoading(false);
				setHasError(false);
			}
        ).catch(err => {
			setError(err.message);
			setHasError(true);
			setLoading(false);
		}
			);			
	}
	else{
		setHasError(true);
		setLoading(false);
	}}, [currentPage]);

	useEffect(async() => {
		let url = null;
		if(searchTerm){
		url  = baseUrl + 'titleStartsWith=' + searchTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
		
        setLoading(true)
        await axios.get(url).then(
            ({data}) => {
				setState({data: data.data.results});
				setSearchData(data.data.results);
				if(data.data.results.length>0){
					setHasError(false);
				}else{
					setHasError(true);
				}
				setLoading(false);
			}
        ).catch(err => {
			setSearchData('');
			setError(err.message);
			setHasError(true);
			setLoading(false);
		});

			
	}
}, [searchTerm]);

	return state
};


	let { SeriesData} = useAxios(baseurl)


	const searchValue = async (value) => {
		setSearchTerm(value);	
	};

	const buildCard = (seriesData) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={seriesData.id}>
				<Card className={classes.card} variant='outlined'>
						<CardActionArea>
						<Link key= {seriesData.id} to={`/series/${seriesData.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={seriesData.thumbnail && seriesData.thumbnail.path + '.' + seriesData.thumbnail.extension ? seriesData.thumbnail.path + '.' + seriesData.thumbnail.extension: noImage}
								title='show image'
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{seriesData.title}
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
            searchData.map((series) => {
				return buildCard(series);
			});

	}
	else {
		card =
            seriesData &&
            seriesData.map((series) => {
				return buildCard(series);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if(hasError){
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
		}
	else{
	return(
		<div>
			<div>
				<SearchComponent searchValue={searchValue} searchTerm = {searchTerm} />
			</div>
		<br/>
		<br/>
		<div>
			{!searchTerm && currentPage > 0 ?(<Link className='showlink' to={`/series/page/`+(parseInt(currentPage)-1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Previous</Button></Link>) : ''}

			{!searchTerm && seriesData && seriesData.length >= 100 ?(<Link className='showlink' to={`/series/page/`+(parseInt(currentPage)+1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Next</Button></Link>) : ''}

			{searchData && searchData.length >= 100 ?(<Link className='showlink' to={`/series/page/`+(parseInt(currentPage)+1)}><Button className={classes.buttonclass} variant="contained" color='secondary' size='medium'>Next</Button></Link>) : ''}
		</div>
				<br />
				<br />
		<Grid container className={classes.grid} spacing={5}>
					{card}
		</Grid>
		</div>
		)}

};


export default SeriesList;