var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "reddipaper@gmail.com",
        pass: "vua7wj6mrp"
    }
});

exports.share = function(from, to, subject, message, callback) {

	console.log('[share] from: ' + from);
	console.log('[share] to: ' + to);
	console.log('[share] subject: ' + subject);
	console.log('[share] message: ' + message);

	var mailOptions = {
		from: from,
		to: to,
		subject: subject,
		text: message
	};

	smtpTransport.sendMail(mailOptions, function(error){
		if (error) {
		    callback(error)
		    
		}

		else {
		    callback()
		}

	});

}