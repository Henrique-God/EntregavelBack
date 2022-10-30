import express from 'express';
import morgan from 'morgan'
import routes from './routes'
const app = express ();

app.use( morgan('dev'));

app.use(express.json());

app.use(routes);

app.get('/', (request, response) =>{
    return response.json({ message: 'Opa12312!'});
});

app.listen(3333, ()=>{
    console.log("🚀Sever started on port 3333!");
});