//npm instal express pg bcrypt pg-hstore sequelize nodemon routes path cors cookie-parser concurrently mongoose jsonwebtoken
//npm install -g create-react-app
//rodar no powershell: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routes');
const port = 5000 //|| process.env.PORT  
const cors = require('cors');
const QRCode = require('qrcode');

app.use(cors())
app.use(cookieParser())

require('./database');

app.use(express.json()); //serve para receber e enviar json do front para o back
app.use(routes);

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`)
});
//********************************************************************************************

let data = {
    name: "Employee Name",
    age: 27,
    department: "Police",
    id: "aisuoiqu3234738jdhf100223"
}
let x = "1"

// Converting the data into String format
let stringdata = JSON.stringify(x)

// Print the QR code to terminal
QRCode.toString(x, { type: 'terminal', errorCorrectionLevel: 'H' },
    function (err, QRcode) {
        if (err) return console.log("error occurred")
        // Printing the generated code
        //console.log(QRcode)
    })

// Converting the data into base64
QRCode.toDataURL(stringdata, function (err, code) {
    if (err) return console.log("error occurred")

    // Printing the code
    //console.log(code)
})
