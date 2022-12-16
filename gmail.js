////////////////////////////////////////////////////////////////////
// This module define the Gmail class
/////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
/////////////////////////////////////////////////////////////////////
const nodemailer = require('nodemailer')
const serverVariables = require("./serverVariables");
let GmailAccountEmail = serverVariables.get("main.gmail.accountEmail");
let GmailAccountPassword = serverVariables.get("main.gmail.accountPassword");
let GmailHost = serverVariables.get("main.gmail.host");
let GmailPort = serverVariables.get("main.gmail.port");
module.exports =
    class Gmail {
        constructor() {
            this.transporter = nodemailer.createTransport({
                host: GmailHost,
                port: GmailPort,
                auth: {
                    user: "kawaimantis@gmail.com",
                    pass: "embelxddgahruymd"
                }
            })
        }

        async send(to, subject, html) {
            let from = "kawaimantis@gmail.com";
            await this.transporter.sendMail({ from, to, subject, html }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
        }
    }