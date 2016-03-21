var postmark = require('postmark')(process.env.POSTMARK_API_TOKEN);

exports.share = function(to, text, subject, callback) {

	//console.log('[share] to: ' + to);
	//console.log('[share] subject: ' + subject);
	//console.log('[share] text: ' + text);

	postmark.send({
		"From": "reddup@reddup.co",
		"To": to,
		"Subject": subject,
		"TextBody": text,
		"Tag": "share"
	}, function(err, success) {
		if (err) callback(err);
		callback();

	});

};