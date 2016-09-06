var postmark = require('postmark')(process.env.POSTMARK_API_TOKEN);

exports.share = function(to, shareTitle, shareLink, name, optionalMessage, callback) {

    console.log('[rpMailHandler] share()');

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

    postmark.send({
        "From": "reddup@reddup.co",
        "To": to,
        "Subject": 'u/' + name + ' has shared a link with from from reddup.co',
        "HtmlBody": htmlBody,
        "Tag": "share"
    }, function(err, success) {
        if (err) callback(err);
        else callback();

    });

};
