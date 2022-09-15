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
};



module.exports = {
  login: (req, res) => {   
    const { username, password } = req.body;
    let users = [];
    sequelize.query(`select * from users`)
          .then((dbRes) => {        
              users = dbRes[0]
              for (let i = 0; i < users.length; i++) {                
                if (users[i].username == username && bcrypt.compareSync(password, users[i].password)) {  
                  let result = {
                    username: users[i].username,
                    firstname: users[i].firstname,
                    lastname: users[i].lastname
                  } 
                  return res.status(200).send(result)
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
      const passHash = bcrypt.hashSync(password,salt);
      let bodyKeys = Object.keys(req.body);    
    for(let i of bodyKeys){
      if((typeof req.body[i]) == 'string'){
        req.body[i] = escapeQuote(req.body[i])
      }   
    }
        sequelize.query(`SELECT * FROM users WHERE username ='${username}'
          `).then(dbRes =>{
            if(dbRes[0].length != 0){
              res.send("Username unvailable")
            }
            else{              
          sequelize.query(`CREATE TABLE ${username} (
            item_id SERIAL PRIMARY KEY,
            location_name VARCHAR,
            location_address VARCHAR,
            location_id VARCHAR,
            opening_hrs VARCHAR,            
            category VARCHAR,
            photo VARCHAR,
            username VARCHAR  REFERENCES users (username));`);
          sequelize.query(`INSERT INTO users (username, password, email, firstname, lastname)
          VALUES ('${username}', '${passHash}','${email}', '${firstName}', '${lastName}')`)
          .then(dbRes =>{
                res.status(200).send({firstName,lastName})
          })  
            }
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
    let bodyKeys = Object.keys(req.params);    
    for(let i of bodyKeys){
      if((typeof req.params[i]) == 'string'){
        req.params[i] = escapeQuote(req.params[i])
      }   
    }
    sequelize.query(`SELECT * FROM ${req.params.username} WHERE category = 'befine'`)
      .then(dbRes =>{
        res.status(200).send(dbRes[0]);        
      }
      )
},

removeFavourite : (req,res)=>{     
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
  let bodyKeys = Object.keys(req.params);    
  for(let i of bodyKeys){
    if((typeof req.params[i]) == 'string'){
      req.params[i] = escapeQuote(req.params[i])
    }   
  }
  sequelize.query(`SELECT username, firstname, lastname, email FROM users WHERE username = '${req.params.username}'`)
    .then(dbRes =>{
      res.status(200).send(dbRes[0]);     
    }
    )
},

editUser: (req,res) =>{ 
  let bodyKeys = Object.keys(req.body);    
  for(let i of bodyKeys){
    if((typeof req.body[i]) == 'string'){
      req.body[i] = escapeQuote(req.body[i])
    }   
  }
  sequelize.query(`UPDATE users SET ${req.body.item} = '${req.body.newvalue}' WHERE username = '${req.body.username}'`)
    .then( dbRes =>{
      if(res.status(200)){
        sequelize.query(`SELECT username, firstname, lastname, email FROM users WHERE username = '${req.body.username}'`)
      .then(dbRes =>{
        res.status(200).send(dbRes[0]);
      }
      )
      }    
    }
  )
},

deleteUser: (req,res) =>{  
  let username = req.params.username;
  console.log(username)
  escapeQuote(username);
  sequelize.query(`DROP TABLE ${username};
  DELETE FROM users WHERE username = '${username}';`)
    .then( dbres => res.status(200).send(console.log('user deleted')))
},

}
