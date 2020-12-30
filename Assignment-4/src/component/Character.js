import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const Character = (props) => {

    const [ characterData, setcharacterData ] = useState(undefined);
    const [ loading, setLoading ] = useState(true);
	const classes = useStyles();
	const [error, setError] = useState('');
	const [hasError, setHasError] = useState(false);

    const md5 = require('blueimp-md5');
    const publickey = '95c1744620cf92c396f0972b69ca790f';
    const privatekey = 'c4a2db946acd4f1785d3761f220bbb93ed8608a7';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${props.match.params.id}?`;
	const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    
    useEffect(async() => {
        setLoading(true)
        await axios.get(url).then(
            res => {
				console.log(url);
				console.log(res);
                setcharacterData(res.data.data.results[0]);
				setLoading(false);
				setHasError(false);
			}
        ).catch(err => {
			setError(err.message);
			setHasError(true);
			setLoading(false);});
			
    }, [props.match.params.id]);
    
    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if(hasError) 
	{
		return(
			<div>
			<h2>No result found!!</h2>
			<h3>{error}</h3>
			</div>
			)
	}
	else {
		return (
			<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={characterData.name} />
				<CardMedia
                    className={classes.media}
                    component='img'
                    image={characterData.thumbnail && characterData.thumbnail.path + '.' + characterData.thumbnail.extension ? characterData.thumbnail.path + '.' + characterData.thumbnail.extension: noImage}
                    title='show image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
						<p>
							<dt className='title'>Comics Available:</dt>
							{characterData && characterData.comics.available ? <dd>{characterData.comics.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Comics Data:</dt>
                        {characterData && characterData.comics.items && characterData.comics.items.length >= 1 ? (
                            <span>
                                {characterData.comics.items.map((comicsData) => {
                                    if (comicsData.length > 1) return <Link underline='hover' color='secondary' to={`/series/${comicsData.resourceURI.lastIndexOf('/')}`}><dd key={comicsData.resourceURI.lastIndexOf('/')}>{comicsData.name},</dd></Link>;
                                    return <Link underline='hover' color='secondary' to={`/series/${comicsData.resourceURI.lastIndexOf('/')}`}><dd key={comicsData.resourceURI.lastIndexOf('/')}>{comicsData.name},</dd></Link>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						<p>
							<dt className='title'>Series Available:</dt>
							{characterData && characterData.series.available ? <dd>{characterData.series.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Series Data:</dt>
                        {characterData && characterData.series.items && characterData.series.items.length >= 1 ? (
                            <span>
                                {characterData.series.items.map((seriesData) => {
                                    if (seriesData.length > 1) return <Link underline='hover' color='secondary' to={`/series/${seriesData.resourceURI.lastIndexOf('/')}`}><dd key={seriesData.resourceURI.lastIndexOf('/')}>{seriesData.name},</dd></Link>;
                                    else return <Link underline='hover' color='secondary' to={`/series/${seriesData.resourceURI.lastIndexOf('/')}`}><dd key={seriesData.resourceURI.lastIndexOf('/')}>{seriesData.name},</dd></Link>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						<p>
							<dt className='title'>Stories Available:</dt>
							{characterData && characterData.stories.available ? <dd>{characterData.stories.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Stories Data:</dt>
                        {characterData && characterData.stories.items && characterData.stories.items.length >= 1 ? (
                            <span>
                                {characterData.stories.items.map((storyData) => {
                                    if (storyData.length > 1) return <dd key={storyData.name}>{storyData.name},</dd>;
                                    else return <dd key={storyData.name}>{storyData.name},</dd>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						</dl>
						<Link to='/characters/page/0'>Back to all Characters...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}

};

export default Character;