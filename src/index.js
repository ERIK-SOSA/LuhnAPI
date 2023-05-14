const { validateCard } = require('credit-card-validator');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const mongoose = require('mongoose');
const Number = require('./models/number');
const { config } = require('./config/config')
const cors = require('cors');

const app = express();
// const PUERTO = process.env.PUERTO
const PORT = 3000

// Midleware
app.use(bodyParser.json());
app.use(cors({origin: '*'}))

// DB Connection
// const uri = "mongodb+srv://SosaErik:GN29lAngDzUrxBoJ@produccion.dcziz.mongodb.net/CreditCardLuhn"
const uri = `mongodb+srv://${config.dbUser}:${config.dbPassword}@produccion.dcziz.mongodb.net/${config.dbName}`


app.listen(config.port, () => {
  console.log('Servidor corriendo en el puerto',config.port);
})


//Conexion hacia la base de datos
mongoose.connect(uri)
.then(() => {
  console.log('Conectado a la base de datos');
})
.catch((error) => {
  console.error(error);
});


app.get('/', (req, res) => {
  res.send('¡Bienvenido!\nAPI Credit Card Validator');
})

app.post('/validartarjeta', (req, res) => {
  const { creditCardNumber } = req.body;
  if(creditCardNumber === undefined || creditCardNumber === null) {
    return res.status(400).json({
      result: false,
      status: 400,
      message: 'Ingrese un número de tarjeta a validar!'
    })
  }
  // const creditCardNumber = numero;
  // console.log(req.body)
  const validation = esNumeroTarjetaValido(creditCardNumber);
  try {
    if (validation) {
      // res.send('La tarjeta de crédito es válida');
      res.status(200).json({
        result: true,
        status: 200,
        message: 'La tarjeta de crédito es válida y ha sido registrada!'
      });
      console.log('La tarjeta de crédito es valida')

      // Crear el numero
      const number = new Number({
        number: creditCardNumber,
        createdDate: Date.now()
      });
      number.save()
          .then(() => {
            console.log('Numero registrado');
          })
          .catch((error) => {
            console.error(error);
          });

    } else {
      // res.send('La tarjeta de crédito no es válida');
      res.status(200).json({
        result: false,
        status: 200,
        message: 'La tarjeta de crédito no es válida'
      })
      console.log('La tarjeta de crédito no es válida')
    }
  }catch (e) {
    return res.status(500).json({
      result: false,
      status: 500,
      message: e.message
    })
  }
});

function esNumeroTarjetaValido(numero) {
  console.log("Numero >> ",numero)
  if (numero === ""){
    return false;
  }
  const digitos = numero.toString().split('');
  const suma = digitos.reduce((acumulador, digito, indice) => {
    let valor = parseInt(digito, 10);
    if ((digitos.length - indice) % 2 === 0) {
      valor *= 2;
      if (valor > 9) {
        valor -= 9;
      }
    }
    return acumulador + valor;
  }, 0);
  console.log(suma % 10 === 0)
  return suma % 10 === 0;
}