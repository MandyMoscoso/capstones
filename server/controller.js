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
          sequelize.query(`CREATE TABLE ${username} (
            location_name VARCHAR,
            location_address VARCHAR,
            location_id VARCHAR,
            opening_hrs VARCHAR,
            username VARCHAR  REFERENCES users (username),
            category VARCHAR
        );`);
          sequelize.query(`INSERT INTO users (username, password, email, firstname, lastname)
          VALUES ('${username}', '${passHash}','${email}', '${firstName}', '${lastName}')`)
          .then(dbRes =>{
            
            res.status(200).send({firstName,lastName})
          })
             
            },

  addFitFavourite:(req,res) =>{
    // console.log(req.body)  
    const{name, formatted_address,place_id, username, category} = req.body;
    console.log(name)
    sequelize.query(`INSERT INTO ${username} (username, location_name, location_address, location_id, category) VALUES ('${username}', '${name}','${formatted_address}', '${place_id}', '${category}')
    `)
    res.status(200).send("updated on server side")
  }
}
