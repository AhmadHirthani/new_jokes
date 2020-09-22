require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const { query } = require('express');
const db_url = process.env.db_url;
console.log({ db_url });
const client = new pg.Client(db_url);
var bodyParser = require('body-parser')

app.set('view engine', 'ejs');
const methodOverride = require('method-override');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(cors());
app.use(methodOverride('_method'))


const port = process.env.port;

app.get('/', handleHomePage);
app.post("/jokes", handleAddJoke);
app.get('/fav', handleFav);
app.delete('/delete/:id', handleDeleteJoke);
app.put('/update/:id', handleUpdate);



// app.put('/jokes/:id', handleUpdateJoke);
// app.delete('/jokes/:id', handleDeleteJoke);

function handleUpdate(req, res) {
    console.log('handleUpdate called');
    let id = req.params.id;
    let type = req.body.type;
    let setup = req.body.setup;
    let punchline = req.body.punchline;
    let values = [type, setup, punchline, id];


    console.log({ id });
    let sql = `update jokes set type=$1,setup=$2,punchline=$3 where id=$4;`;
    client.query(sql, values).then(data => {
        console.log({ data });
    })


}

async function handleHomePage(req, res) {
    let url = `https://official-joke-api.appspot.com/random_ten`;
    superagent.get(url).then(data => {
        let result = data.body;
        res.render('index', { jokes: result })
    })

}


function handleFav(req, res) {
    console.log('handle fav called');
    let sql = `select * from jokes;`;
    client.query(sql).then((data) => {
        let result = data.rows;
        res.render('fav', { jokes: result })

    })

}

function handleAddJoke(req, res) {
    console.log('req.body>>>>>', req.body);
    let sql = `insert into jokes (id,type,setup,punchline) values ($1,$2,$3,$4);`;
    let values = [req.body.id, req.body.type, req.body.setup, req.body.punchline];
    console.log({ values });
    client.query(sql, values).then(data => {
        console.log({ data });
    })

}


async function handleUpdateJoke(req, res) {

}


async function handleDeleteJoke(req, res) {
    console.log('handle delete called');
    console.log('req.body>>>>>', req.params.id);
    let id = req.params.id;
    console.log({ id });
    let sql = `delete from jokes where id=${id}`;
    client.query(sql).then(data => {
        console.log({ data });
    })

}

function getJokeFromApi() {
    let url = `https://official-joke-api.appspot.com/random_ten`;
    superagent.get(url).then(data => {
        let result = data.body;
        console.log('data.body: ', data.body);
        return result;
    })
}

function addJokeToDb(joke) {


}

client.connect().then(() => {
    app.listen(port, () => {
        console.log(`App running on port ${port}.`)
    })
})