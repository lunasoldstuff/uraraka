var helper = require('sendgrid').mail;
var from_email = new helper.Email('reddup@reddup.co');


exports.share = function (to, shareTitle, shareLink, name, optionalMessage, callback) {

    console.log('[rpMailHandler] share()');

    var to_email = new helper.Email(to);
    var subject = 'u/' + name + ' has shared a link with from from reddup.co';


    //console.log('[share] to: ' + to);
    //console.log('[share] subject: ' + subject);
    //console.log('[share] text: ' + text);

    var htmlBody = "Hey There! ";
    htmlBody += "<br/>";
    htmlBody += "<br/>";
    htmlBody += "u/" + name + " shared this link with you from <a href='http://reddup.co'>reddup.co</a> ";
    htmlBody += "<br/>";
    htmlBody += "<br/>";
    htmlBody += optionalMessage;
    htmlBody += "<br/>";
    htmlBody += "<br/>";
    htmlBody += "<a href=" + shareLink + ">" + shareTitle + "</a>";
    htmlBody += "<br/>";
    htmlBody += "<br/>";
    htmlBody += "<a href='http://reddup.co'><img style='width:206px; height:78px;' src='http://reddup.co/images/reddup.png'/></a>";

    var content = helper.Content('text/html', htmlBody);

    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function (error, response) {
        if (error) callback(error);
        else callback();
    });

};

exports.feedback = function (to, title, text, name, callback) {
    //send an email to reddup@reddup.co

    console.log('[rpMailHandler feedback] to: ' + to);
    console.log('[rpMailHandler feedback] title: ' + title);
    console.log('[rpMailHandler feedback] text: ' + text);
    console.log('[rpMailHandler feedback] name: ' + name);

    var to_email = new helper.Email(to);

    var subject = "[FEEDBACK] USER: " + name + ", TITLE: " + title;
    var content = text;

    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function (error, response) {
        if (error) callback(error);
        else callback();
    });

};