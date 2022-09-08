require('dotenv').config()
const {CONNECTION_STRING} = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})
const bcrypt = require('bcryptjs');


const escapeQuote=(str) =>{
   return str.replaceAll(`'`, `''`)
}

module.exports = {
  login: (req, res) => {
    console.log('Logging In User')
   
    console.log(req.body)
    const { username, password } = req.body;
    let users = [];
    sequelize.query(`select * from users`)
          .then((dbRes) => {
              console.log(dbRes[0]);
              users = dbRes[0]
              for (let i = 0; i < users.length; i++) {                
                if (users[i].username == username && bcrypt.compareSync(password, users[i].password)) {                                
                  return res.status(200).send(users[i].username)
                }
              }
              res.status(400).send("User not found.")
              
          });
      
    
    
  },
  register: (req, res) => {
      console.log('Registering User')
      console.log(req.body) 
      const {password,username,email,firstName,lastName} = req.body;       
      const salt = bcrypt.genSaltSync(10);        
      //The hash represents the actual encryption of our password.
      const passHash = bcrypt.hashSync(password,salt);
      // console.log(password);
      let bodyKeys = Object.keys(req.body);    
    for(let i of bodyKeys){
      if((typeof req.body[i]) == 'string'){
        req.body[i] = escapeQuote(req.body[i])
      }   
    }
          sequelize.query(`CREATE TABLE ${username} (
            item_id SERIAL PRIMARY KEY,
            location_name VARCHAR,
            location_address VARCHAR,
            location_id VARCHAR,
            opening_hrs VARCHAR,            
            category VARCHAR,
            photo VARCHAR,
            username VARCHAR  REFERENCES users (username)
            
        );`);
          sequelize.query(`INSERT INTO users (username, password, email, firstname, lastname)
          VALUES ('${username}', '${passHash}','${email}', '${firstName}', '${lastName}')`)
          .then(dbRes =>{
            
            res.status(200).send({firstName,lastName})
          })
             
            },

  addFavourite:(req,res) =>{
    
    let bodyKeys = Object.keys(req.body);    
    for(let i of bodyKeys){
      if((typeof req.body[i]) == 'string'){
        req.body[i] = escapeQuote(req.body[i])
      }   
    }
    const{name, formatted_address,place_id, username, category, photo} = req.body;    
    
    sequelize.query(`INSERT INTO ${username} (username, location_name, location_address, location_id, category, photo) VALUES ('${username}', '${name}','${formatted_address}', '${place_id}', '${category}', '${photo}')
    `)
    res.status(200).send("updated on server side")
  },
  
  showFitFave: (req,res) =>{
    // console.log(req.params.username)
    let bodyKeys = Object.keys(req.params);    
    for(let i of bodyKeys){
      if((typeof req.params[i]) == 'string'){
        req.params[i] = escapeQuote(req.params[i])
      }   
    }
    sequelize.query(`SELECT * FROM ${req.params.username} WHERE category = 'befit'`)
      .then(dbRes =>{
        res.status(200).send(dbRes[0]);
        console.log('res sent')
      }
      )
  },

  showFullFave: (req,res) =>{
    // console.log(req.params.username)
    let bodyKeys = Object.keys(req.params);    
    for(let i of bodyKeys){
      if((typeof req.params[i]) == 'string'){
        req.params[i] = escapeQuote(req.params[i])
      }   
    }
    sequelize.query(`SELECT * FROM ${req.params.username} WHERE category = 'befull'`)
      .then(dbRes =>{
        res.status(200).send(dbRes[0]);
        
      }
      )
  },

  showFineFave: (req,res) =>{
    // console.log(req.params.username)
    let bodyKeys = Object.keys(req.params);    
    for(let i of bodyKeys){
      if((typeof req.params[i]) == 'string'){
        req.params[i] = escapeQuote(req.params[i])
      }   
    }
    sequelize.query(`SELECT * FROM ${req.params.username} WHERE category = 'befine'`)
      .then(dbRes =>{
        res.status(200).send(dbRes[0]);
        console.log('res sent')
      }

      )
  },
   removeFavourite : (req,res)=>{        
    console.log(req.body)
    let {id, username} = req.body;
    id = id*1;
    let bodyKeys = Object.keys(req.body);    
    for(let i of bodyKeys){
      if((typeof req.body[i]) == 'string'){
        req.body[i] = escapeQuote(req.body[i])
      }   
    }
    sequelize.query(`DELETE FROM ${username} WHERE item_id = ${id}`)
    .then (dbRes => res.status(200).send("item removed"))
},

getUser: (req,res) =>{
  console.log(req.params)
  let bodyKeys = Object.keys(req.params);    
  for(let i of bodyKeys){
    if((typeof req.params[i]) == 'string'){
      req.params[i] = escapeQuote(req.params[i])
    }   
  }
  sequelize.query(`SELECT username, firstname, lastname, email FROM users WHERE username = '${req.params.username}'`)
    .then(dbRes =>{
      res.status(200).send(dbRes[0]);
      console.log('res sent')
    }
    )
},


}
