import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UnSplashImageData from './Home';
import MyBinData from './MyBin';
import MyPost from './MyPost';
import NewPost from './newPost';
import Error from './ErrorComponent';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">
              GraphQL With Apollo Client/Server Demo
            </h1>
            <nav>
              <NavLink className="navlink" to="/">
              UnSplashImageData
              </NavLink>
              <NavLink className="navlink" to="/my-bin">
                MyBin
              </NavLink>

              <NavLink className="navlink" to="/my-posts">
                MyPost
              </NavLink>
              <NavLink className="navlink" to="/new-post">
              New Post
            </NavLink>
            </nav>
          </header>
          <Switch>
          <Route exact path="/" exact component={UnSplashImageData} />
          <Route exact path="/my-bin" exact component={MyBinData} />
          <Route exact path="/my-posts" exact component={MyPost} />
          <Route exact path="/new-post" exact component={NewPost} />
          <Route  path = '*' exact component={Error} status={404}/>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
