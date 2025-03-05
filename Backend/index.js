const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose');

const app = express()

app.use(cors())
app.use(express.json())

const corsOptions = {
  origin: [
    "http://localhost:5173",  // Allow local frontend
    "https://bulkmail-app-seven.vercel.app"  // Allow deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));


require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));


const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", function (req, res) {

    res.header("Access-Control-Allow-Origin","https://bulkmail-app-vm31.vercel.app/")

    console.log("Received Data:", req.body);

    var msg = req.body.msg
    var emailList = req.body.emaillist

    if (!emailList || !Array.isArray(emailList)) {
        return res.status(400).json({ error: "Invalid email list" });
    }

    console.log(emailList, msg)

    credential.find().then(function (data) {

        console.log(data[0].toJSON().user)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i <= emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "ajaykarthikeyan436@gmail.com",
                            to: emailList[i],
                            subject: "A Messsage From Bulkmail App",
                            text: msg
                        },
                    )

                    console.log("Email sent to:" + emailList[i])
                }

                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })

    }).catch(function (error) {
        console.log(error)
    })
})

const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

