const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose');

const app = express()

app.use(cors())
app.use(express.json())

const corsOptions = {
    origin: ["https://bulkmail-app-seven.vercel.app"], // Add your frontend URL here
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));


mongoose.connect("mongodb+srv://ajaykarthikeyan436:1234@cluster0.lj0sn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        serverSelectionTimeoutMS: 5000, // Stop trying after 5 seconds
        socketTimeoutMS: 45000, // Close socket after 45 seconds
    })
    .then(function () { console.log("Connected To DB") })
    .catch(function () { console.log("Failed To Connect") })

const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", function (req, res) {

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

