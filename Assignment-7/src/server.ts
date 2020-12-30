import app from './app';
const port = process.env.PORT||3000;
import { App } from './mongo.helper';

app.listen(port, async () => {
  console.log('Express server listening on port ' + port);
  try 
  {
    await App.MongoHelper.connect(`mongodb://localhost:27017/Gupta-Priya-CS554-Lab1`);
    console.log(`Listening on port ${port}`);
    // await MongoHelper.connect(`mongodb://localhost:27017/Gupta-Priya-CS554-Lab1`);
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err);
  }
});