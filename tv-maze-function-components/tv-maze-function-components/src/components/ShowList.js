import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
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
		fontWeight: 'bold'
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
	}
});
const ShowList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	// const [ showsData, setShowsData ] = useState(undefined);
	const [ showsData, setShowsData ] = useState('');
	const [ searchTerm, setSearchTerm ] = useState('');
	const [isError, setIsError] = useState('');
	const [pagingData, setPagingData] = useState('');
	
	let card = null;
	let currentPage = null;

	

if (props.match.params.pagenum === undefined){
	if(currentPage == null){
	currentPage =0;}
}
else{
	currentPage = (parseInt(props.match.params.pagenum));
}
// let nextLink = `shows/page/`+ (parseInt(currentPage)+1);

	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {
			if(currentPage === null){
			const { data } = await axios.get('http://api.tvmaze.com/shows');
				setShowsData(data);
				setLoading(false);}
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					// setPagingData('');
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				fetchData();
			}
		},
		[ searchTerm]
	);

	useEffect(() => {
		async function fetchData() {
		  try {
			setLoading(true);
			const { data } = await axios.get("http://api.tvmaze.com/shows?page=" + currentPage);
			// setShowsData(data);
			setLoading(false);
			setIsError(false);
			setSearchTerm('');
			setPagingData(data);
			setShowsData('');
		  } catch (e) {
			setIsError(true);
			console.log(e);
		  }
		}
		fetchData();
	  }, [currentPage]);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.image && show.image.original ? show.image.original : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{show.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	}
	else if (pagingData){
		card =
			pagingData &&
			pagingData.map((show) => {
				return buildCard(show);
			});
	}
	else if(showsData){
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}
	else{
		if(isError && !searchTerm)
		return(
				<div>
					<SearchShows searchValue={searchValue} />
				<br />
				<br />
					<h1>No Data found for this Page Number</h1>
				<br />
				</div>
			)
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	 else {
			return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				<div>
					 {!isError && !searchTerm && currentPage > 0 ?(<Link activeclassname="active" to={`/shows/page/`+(parseInt(currentPage)-1)}> <span> Previous </span> </Link>): ''}

					 {!isError && !searchTerm && pagingData && pagingData.length > 200 ?(<Link activeclassname="active" to={`/shows/page/`+(parseInt(currentPage)+1)} style={{marginLeft:'5%'}}><span> Next </span></Link>) : ''}

					 {searchData && searchData.length > 200 ?(<Link className='showlink' to={`/shows/page/`+(parseInt(currentPage)+1)}><a href='#'>Next</a></Link>) : ''}
					
				</div>
				<br />
				<br />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}

};

export default ShowList;
