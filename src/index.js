const { validateCard } = require('credit-card-validator');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const mongoose = require('mongoose');
const Number = require('./models/number');
const dotenv = require('dotenv');

const app = express();
// const PUERTO = process.env.PUERTO
const PORT = 3000

app.use(bodyParser.json());

const uri = "mongodb+srv://SosaErik:GN29lAngDzUrxBoJ@produccion.dcziz.mongodb.net/CreditCardLuhn"
// const uri = "mongodb+srv://<username>:<password>@produccion.dcziz.mongodb.net/<database>"

app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto',PORT);
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
  // const creditCardNumber = numero;
  // console.log(req.body)
  const validation = esNumeroTarjetaValido(creditCardNumber);
  
  if (validation) {
    res.send('La tarjeta de crédito es válida');
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
    res.send('La tarjeta de crédito no es válida');
    console.log('La tarjeta de crédito no es válida')
  }
});

function esNumeroTarjetaValido(numero) {
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
  return suma % 10 === 0;
}