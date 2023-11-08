// string de conexão com o banco
// mongodb+srv://arthurfalzetta:<pipoca17>@cluster0.jtj4pqu.mongodb.net/?retryWrites=true&w=majority


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const uniqueValidator = require('mongoose-unique-validator');

app.use(express.json());
app.use(cors());

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema ({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarMongo() {
    await mongoose.connect (`mongodb+srv://arthurfalzetta:pipoca17@cluster0.jtj4pqu.mongodb.net/?retryWrites=true&w=majority`)
}

let filmes = [
    {
    titulo: "Forrest Gump - O Contador de Histórias",
    sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks),um rapaz com QI abaixo da média e boas intenções."
    },
    {
    titulo: "Um Sonho de Liberdade",
    sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela"
    }
]


// ponto de acesso para atender requisições get oi
app.get('/oi', (req,res) => {res.send('oi')})

// ponto para acesso para atender as requisições get filmes
app.get('/filmes', async (req,res) => {
    const filmes = await Filme.find();
    res.json(filmes);
})

// ponto de acesso para inserir um novo filme na memoria
app.post('/filmes', async (req, res) => {
    // Recupera os dados da requisição
    const titulo = req.body.titulo;
    const sinopse = req.body.sinopse;
    // monta o objeto json
    const filme = new Filme ({
        titulo: titulo,
        sinopse: sinopse
    })
    // insere o filme na base Mongo
    await filme.save();
    // carregar base atualizada
    const filmes = await Filme.find();
    res.json(filmes);
})

app.post('/signup', async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const usuario = new Usuario ({
        login: login,
        password: password
    })
    const respMongo = await usuario.save();
    console.log(respMongo);
    res.end();
})

app.listen(3000, () => {
    try {
        conectarMongo();
        console.log ("conexao ok e app up & running");
    }
    catch (e) {
        console.log('ups: ', e);
    }
});