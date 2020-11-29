var express = require('express'); //Déclaration des packs Express (qu'il faut installer) la variable express nous permettra d'utiliser les fonctionnalités du module Express.
var mongoose = require('mongoose');//importation des packs Mongoose (qu'il faut installer aussi)

// connection à la base de données / paramètres du serveur
var options = {
    server: 
    { socketOptions:
         { keepAlive: 300000, connectTimeoutMS: 30000 }      
    },
    replset: 
    { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } 
    }
    
               };

    
var urlmongo = 'mongodb+srv://majdoline:majdoline@cluster0.mpyfs.mongodb.net/blog?retryWrites=true&w=majority'; // url de la BDD mongo
mongoose.connect(urlmongo, options); // connection de l'API à la base de données
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); // retour si erreur de co
db.once('open', function (){
    console.log("Connexion à la base OK"); // message sacré tout va BIEN !
});


// Données serveur
var hostname = 'localhost';
var port = 3000;

var app = express();
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {//ajout des données du CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// création du modèle pour Article
var articleSchema = mongoose.Schema({ // réalisation des données du Schéma
    titre : {
        type :String,
    //required: true 
            },
    auteur : {
        type :String,
   // required: true
            },
    date : {type: String},
    contenu : {
        type :String,
  //required: true
            }
});

var Article = mongoose.model('Article', articleSchema); // création de la variable article = lié au schema du dessus 

// routes
var myRouter = express.Router();

// route vers la home localhost3000 donc
myRouter.route('/')
    .all(function(req,res){
        res.json({message : "Bienvenue sur notre API d'articles", methode : req.method}); // retour du message à l'arrivée sur la "home"
    });

myRouter.route('/articles')  // route pour obtenir ma liste d'article, magic !
    .get(function(req,res){
        Article.find(function(err, articles) {
            if (err){
                res.send(err);
            }
            res.json(articles);
        });
    })

    // route pour ajouter un article
    .post(function(req,res){
    
        console.log(req.body);

        var article = new Article(); // création d'un nouvel objet de type article

        article.titre = req.body.titre; // récupération des variables du body 
        article.auteur = req.body.auteur; // récupération des variables du body 
        article.date = req.body.date; // récupération des variables du body 
        article.contenu = req.body.contenu; // récupération des variables du body 
        article.save(function(err){
            if(err){
                res.send(err); //message d'erreur en retour
                //return console.error(err); //message d'erreur en retour (+ de détails sur l'erreur)
            }
            res.json({message : 'Bravo, ton article est maintenant stockée en base de données'}); //message retour : confirmer si l'article est bien crée
        });
    });

myRouter.route('/articles/:article_id')
    // route pour sélectionner un seul artique via son ID
    .get(function(req,res){
        Article.findById(req.params.article_id, function(err, article) {
            if (err)
                res.send(err);
            res.json(article);
        });
    });

app.use(myRouter);

// information sur le serveur
app.listen(port, hostname, function(){
    console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});

module.exports = mongoose.model('Article', articleSchema) // exporter mes données dans ma BDD, car ça se fait pas tout seul !

