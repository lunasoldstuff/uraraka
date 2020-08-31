var helper = require('sendgrid')
  .mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = new helper.Email('noreply@uraraka');


exports.share = function (to, shareTitle, shareLink, name, optionalMessage, callback) {
  // console.log('[rpMailHandler] share()');

  const TO_EMAIL = new helper.Email(to);
  let subject = 'u/' + name + ' has shared a link with from from uraraka.herokuapp.com';

  let htmlBody = 'Hey There! ';
  htmlBody += '<br/>';
  htmlBody += '<br/>';
  htmlBody += 'u/' + name + " shared this link with you from <a href='https://uraraka.herokuapp.com'>uraraka.herokuapp.com</a> ";
  htmlBody += '<br/>';
  htmlBody += '<br/>';
  htmlBody += optionalMessage;
  htmlBody += '<br/>';
  htmlBody += '<br/>';
  htmlBody += '<a href=' + shareLink + '>' + shareTitle + '</a>';
  htmlBody += '<br/>';
  htmlBody += '<br/>';
  htmlBody +=
    "<a href='https://uraraka.herokuapp.com'><img style='width: 30%;' src='https://uraraka.herokuapp.com/images/reddup.png'/></a>";

  let content = helper.Content('text/html', htmlBody);

  let mail = new helper.Mail(FROM_EMAIL, subject, TO_EMAIL, content);

  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) callback(error);
    else callback();
  });
};

exports.feedback = function (to, title, text, name, callback) {
  const TO_EMAIL = new helper.Email(to);

  let subject = '[FEEDBACK] USER: ' + name + ', TITLE: ' + title;
  let content = helper.Content('text/plain', text);

  let mail = new helper.Mail(FROM_EMAIL, subject, TO_EMAIL, content);

  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (err, response) {
    if (err) callback(err);
    else {
      callback();
    }
  });
};
