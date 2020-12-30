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

const Series = (props) => {

    const [ seriesData, setseriesData ] = useState(undefined);
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState('');
	const [hasError, setHasError] = useState(false);
    const classes = useStyles();

    const md5 = require('blueimp-md5');
    const publickey = '95c1744620cf92c396f0972b69ca790f';
    const privatekey = 'c4a2db946acd4f1785d3761f220bbb93ed8608a7';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/series/${props.match.params.id}?`;
	const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    
    useEffect(async() => {
        setLoading(true)
        await axios.get(url).then(
            res => {
                setseriesData(res.data.data.results[0]);
                setLoading(false);
                setHasError(false);
			    setLoading(false);
			}
        ).catch(err => {
            setError(err.message);
			setHasError(true);
			setLoading(false)});
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
				<CardHeader className={classes.titleHead} title={seriesData.title} />
				<CardMedia
                    className={classes.media}
                    component='img'
                    image={seriesData.thumbnail && seriesData.thumbnail.path + '.' + seriesData.thumbnail.extension ? seriesData .thumbnail.path + '.' + seriesData.thumbnail.extension: noImage}
                    title='show image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                        <p>
                        <dt className='title'>Creators Available:</dt>
                        {seriesData && seriesData.creators.available ? <dd>{seriesData.creators.available}</dd> : <dd>N/A</dd>}
                    </p>
                    <p>
                    <dt className='title'>Creators Name:</dt>
                    {seriesData && seriesData.creators.items && seriesData.creators.items.length >= 1 ? (
                        <span>
                            {seriesData.creators.items.map((creator) => {
                                if (creator.length > 1) return <dd key={creator.name}>{creator.name}({creator.role}),</dd>;
                                else return <dd key={creator.name}>{creator.name}({creator.role}) ,</dd>;
                            })}
                        </span>
                    ) : (
                        <dd>N/A</dd>
                    )}
                    </p>
						<p>
							<dt className='title'>Characters Available:</dt>
							{seriesData && seriesData.characters.available ? <dd>{seriesData.characters.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Characters Name:</dt>
                        {seriesData && seriesData.characters.items && seriesData.characters.items.length >= 1 ? (
                            <span>
                                {seriesData.characters.items.map((character) => {
                                    if (character.length > 1) return <Link underline='hover' color='secondary' to={`/characters/${character.resourceURI.substr(character.resourceURI.lastIndexOf('/') + 1)}`}><dd key={character.resourceURI.substr(character.resourceURI.lastIndexOf('/') + 1)}>{character.resourceURI.substr(character.resourceURI.lastIndexOf('/') + 1)}{character.name},</dd></Link>;
                                    else return <Link underline='hover' color='secondary' to={`/characters/${character.resourceURI.substr(character.resourceURI.lastIndexOf('/') + 1)}`}><dd key={character.resourceURI.substr(character.resourceURI.lastIndexOf('/') + 1)}>{character.name}</dd></Link>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						<p>
							<dt className='title'>Comics Available:</dt>
							{seriesData && seriesData.comics.available ? <dd>{seriesData.comics.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Comics Items:</dt>
                        {seriesData && seriesData.comics.items && seriesData.comics.items.length >= 1 ? (
                            <span>
                                {seriesData.comics.items.map((comics) => {
                                    if (comics.length > 1) return <Link underline='hover' color='secondary' to={`/comics/${comics.resourceURI.lastIndexOf('/')}`}><dd key={comics.resourceURI.lastIndexOf('/')}>{comics.name},</dd></Link>;
                                    else return <Link nderline='hover' color='secondary' to={`/comics/${comics.resourceURI.lastIndexOf('/')}`}><dd key={comics.resourceURI.lastIndexOf('/')}>{comics.name},</dd></Link>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						<p>
							<dt className='title'>Stories Available:</dt>
							{seriesData && seriesData.stories.available ? <dd>{seriesData.stories.available}</dd> : <dd>N/A</dd>}
						</p>
						<p>
						<dt className='title'>Stories Items:</dt>
                        {seriesData && seriesData.stories.items && seriesData.stories.items.length >= 1 ? (
                            <span>
                                {seriesData.stories.items.map((storyData) => {
                                    if (storyData.length > 1) return <dd key={storyData.name}>{storyData.name},</dd>;
                                    return <dd key={storyData.name}>{storyData.name}</dd>;
                                })}
                            </span>
                        ) : (
                            <dd>N/A</dd>
                        )}
						</p>
						</dl>
						<Link to='/series/page/0'>Back to all Series...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}

};

export default Series;