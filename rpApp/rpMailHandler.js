var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "reddipaper@gmail.com",
        pass: "vua7wj6mrp"
    }
});

exports.share = function(to, text, subject, callback) {

	console.log('[share] to: ' + to);
	console.log('[share] subject: ' + subject);
	console.log('[share] text: ' + text);

	var mailOptions = {
		to: to,
		subject: subject,
		text: text
	};

	smtpTransport.sendMail(mailOptions, function(error){
		if (error) {
		    callback(error);
		    
		}

		else {
		    callback();
		}

	});

};