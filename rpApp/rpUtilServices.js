'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);









rpUtilServices.factory('rpDeleteUtilService', ['rpAppAuthService', 'rpToastService', 'rpAppRedditApiService',
	function(rpAppAuthService, rpToastService, rpAppRedditApiService) {

		return function(name, type, callback) {
			console.log('[rpDeleteUtilService] name: ' + name);
			console.log('[rpDeleteUtilService] type: ' + type);

			var deleteEndpoint = (type === 'message') ? '/api/del_msg' : '/api/del';

			rpAppRedditApiService.redditRequest('post', deleteEndpoint, {
				id: name
			}, function(data) {
				if (data.responseError) {
					rpToastService("something went wrong trying to delete your post", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					rpToastService("post deleted", "sentiment_satisfied");
					callback(null, data);

				}

			});

		};
	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {

		return function(id, save, callback) {

			var uri = save ? '/api/save' : '/api/unsave';

			rpAppRedditApiService.redditRequest('post', uri, {
				id: id
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});


		};

	}
]);

rpUtilServices.factory('rpHideUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {

		return function(id, isHidden, callback) {



			var uri = isHidden ? '/api/unhide' : '/api/hide';

			rpAppRedditApiService.redditRequest('post', uri, {
				id: id
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
]);

rpUtilServices.factory('rpVoteUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {

		return function(id, dir, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/vote', {
				id: id,
				dir: dir
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

	}
]);

rpUtilServices.factory('rpCommentUtilService', ['rpAppAuthService', 'rpAppRedditApiService', 'rpToastService',
	function(rpAppAuthService, rpAppRedditApiService, rpToastService) {

		//to safegaurd against double tapping enter
		//and posting the comment twice
		var replying = false;

		return function(name, comment, callback) {
			console.log('[rpCommentUtilService]');

			if (rpAppAuthService.isAuthenticated) {

				if (comment && !replying) {

					replying = true;

					rpAppRedditApiService.redditRequest('post', '/api/comment', {
						parent: name,
						text: comment
					}, function(data) {
						replying = false;

						if (data.responseError) {
							console.log('[rpCommentUtilService] responseError: ' + JSON.stringify(data));

							var message = "Something went wrong trying to post you comment :/";

							if (data.body) {
								var body = JSON.parse(data.body);

								console.log('[rpCommentUtilService] responseError, data.body.json: ' + JSON.stringify(body.json));

								if (body.json.errors[0][0] === 'TOO_OLD') {
									// message = "That post is too old to comment on.";
									message = body.json.errors[0][1];
								}

							}

							rpToastService(message, "sentiment_dissatisfied");

							callback(data, null);
						} else {
							rpToastService("comment posted", "sentiment_satisfied");
							callback(null, data);

						}

					});
				}

			} else {
				rpToastService("you must log in to post comments", "sentiment_neutral");
			}
		};
	}
]);

rpUtilServices.factory('rpMessageComposeUtilService', ['rpAppAuthService', 'rpAppRedditApiService', 'rpToastService',
	function(rpAppAuthService, rpAppRedditApiService, rpToastService) {
		return function(subject, text, to, iden, captcha, callback) {
			if (rpAppAuthService.isAuthenticated) {

				rpAppRedditApiService.redditRequest('post', '/api/compose', {
					subject: subject,
					text: text,
					to: to,
					iden: iden,
					captcha: captcha
				}, function(data) {

					if (data.responseError) {
						rpToastService("something went wrong trying to send your message", "sentiment_dissatisfied");
						callback(data, null);
					} else {
						console.log('[rpMessageComposeUtilService] data: ' + JSON.stringify(data));
						callback(null, data);
					}

				});

			} else {
				rpToastService("you must log in send messages", "sentiment_neutral");
			}
		};
	}
]);

rpUtilServices.factory('rpSubmitUtilService', ['rpAppAuthService', 'rpAppRedditApiService', 'rpToastService',
	function(rpAppAuthService, rpAppRedditApiService, rpToastService) {

		return function(kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
			console.log('[rpSubmitUtilService] iden: ' + iden);
			console.log('[rpSubmitUtilService] captcha: ' + captcha);


			if (rpAppAuthService.isAuthenticated) {

				rpAppRedditApiService.redditRequest('post', '/api/submit', {
					kind: kind,
					sendreplies: sendreplies,
					sr: sr,
					text: text,
					title: title,
					url: url,
					resubmit: resubmit,
					iden: iden,
					captcha: captcha
				}, function(data) {

					/*
						Handle errors here instead of in controller.
					 */

					console.log('[rpSubmitUtilService] data.constructor.name: ' + data.constructor.name);
					console.log('[rpSubmitUtilService] data: ' + JSON.stringify(data));

					if (data.responseError) {
						callback(data, null);
					} else {
						console.log('[rpSubmitUtilService] data: ' + JSON.stringify(data));
						callback(null, data);
					}

				});

			} else {
				rpToastService("you must log in to submit links", "sentiment_neutral");
			}
		};


	}
]);

rpUtilServices.factory('rpFeedbackUtilService', ['rpFeedbackResourceService', 'rpToastService',
	function(rpFeedbackResourceService, rpToastService) {

		return function(title, text, name, callback) {

			rpFeedbackResourceService.save({
				to: 'reddup@reddup.co',
				title: title,
				text: text,
				name: name,
			}, function(data) {
				rpToastService("feedback sent", "sentiment_satisfied");
				callback(null, data);

			}, function(error) {
				rpToastService("something went wrong trying to send your feedback", "sentiment_dissatisfied");
				callback(error);
			});

		};

	}
]);

rpUtilServices.factory('rpShareEmailUtilService', ['rpShareEmailResourceService', 'rpToastService',
	function(rpShareEmailResourceService, rpToastService) {

		return function(to, shareTitle, shareLink, name, optionalMessage, callback) {

			rpShareEmailResourceService.save({
				to: to,
				shareTitle: shareTitle,
				shareLink: shareLink,
				name: name,
				optionalMessage: optionalMessage
			}, function(data) {
				rpToastService("email sent", "sentiment_satisfied");
				callback(null, data);

			}, function(error) {
				rpToastService("something went wrong trying to send your email", "sentiment_dissatisfied");
				callback(error);
			});

		};

	}
]);

rpUtilServices.factory('rpCaptchaUtilService', ['rpAppAuthService', 'rpToastService', 'rpAppRedditApiService',
	function(rpAppAuthService, rpToastService, rpAppRedditApiService) {

		var rpCaptchaUtilService = {};

		rpCaptchaUtilService.needsCaptcha = function(callback) {

			rpAppRedditApiService.redditRequest('get', '/api/needs_captcha', {

			}, function(data) {

				console.log('[rpCaptchaUtilService] needsCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};

		rpCaptchaUtilService.newCaptcha = function(callback) {

			rpAppRedditApiService.redditRequest('post', '/api/new_captcha', {

			}, function(data) {
				console.log('[rpCaptchaUtilService] newCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

		/* This is not used anywhere */
		// rpCaptchaUtilService.captcha = function(iden, callback) {
		//
		// 	rpCaptchaResourceService.get({
		// 		iden: iden
		// 	}, function(data) {
		// 		// console.log('[rpCaptchaUtilService] captcha, data: ' + JSON.stringify(data));
		//
		// 		if (data.responseError) {
		// 			callback(data, null);
		// 		} else {
		// 			callback(null, data);
		// 		}
		//
		// 	});
		//
		// };

		return rpCaptchaUtilService;

	}
]);

rpUtilServices.factory('rpSubredditsUtilService', [
	'$rootScope',
	'rpAppAuthService',
	'rpToastService',
	'rpAppRedditApiService',

	function(
		$rootScope,
		rpAppAuthService,
		rpToastService,
		rpAppRedditApiService

	) {

		var rpSubredditsUtilService = {};

		rpSubredditsUtilService.subs = [];
		rpSubredditsUtilService.currentSub = "";
		rpSubredditsUtilService.about = {};
		rpSubredditsUtilService.subscribed = null;

		var limit = 50;

		rpSubredditsUtilService.updateSubreddits = function(callback) {

			if (rpAppAuthService.isAuthenticated) {
				loadUserSubreddits(callback);
			} else {
				loadDefaultSubreddits(callback);
			}

		};

		/*
			Continously attempt loading subreddits if it fails to load.
		*/
		function updateSubredditsErrorHandler(error, data) {
			if (error) {
				console.log('[rpSubredditsUtilService] updateSubreddits, load subreddits failed');
				rpSubredditsUtilService.updateSubreddits(updateSubredditsErrorHandler);
			} else {
				console.log('[rpSubredditsUtilService] updateSubreddits, load subreddits success');

			}
		}

		rpSubredditsUtilService.updateSubreddits(updateSubredditsErrorHandler);

		rpSubredditsUtilService.resetSubreddit = function() {
			rpSubredditsUtilService.currentSub = "";
			rpSubredditsUtilService.subscribed = null;
			rpSubredditsUtilService.about = {};
		};

		rpSubredditsUtilService.setSubreddit = function(sub) {
			console.log('[rpSubredditsUtilService] setSubreddit, sub: ' + sub);

			if (sub && rpSubredditsUtilService.currentSub !== sub) {

				rpSubredditsUtilService.currentSub = sub;
				updateSubscriptionStatus();
				loadSubredditAbout();

			}
		};


		function loadUserSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadUserSubreddits()');

			rpAppRedditApiService.redditRequest('listing', '/subreddits/mine/$where', {
				$where: 'subscriber',
				limit: limit,
				after: ""

			}, function(data) {

				if (data.responseError) {
					console.log('[rpSubredditsUtilService] loadUserSubreddits(), ResponseError');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);

				} else {

					if (data.get.data.children.length > 0) {

						rpSubredditsUtilService.subs = data.get.data.children;

						/*
						we have all the subreddits, no need to get more.
						*/
						if (data.get.data.children.length < limit) {
							$rootScope.$emit('subreddits_updated');
							updateSubscriptionStatus();
							callback(null, data);

						} else { //dont have all the subreddits yet, get more.
							loadMoreUserSubreddits(
								data.get.data.children[data.get.data.children.length - 1].data.name,
								callback);

						}

						/*
						no subreddits returned. load deafult subs.
						*/
					} else { //If the user has no subreddits load the default subs.
						loadDefaultSubreddits(callback);
					}

				}

			});
		}

		function loadMoreUserSubreddits(after, callback) {
			console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), after: ' + after);

			rpAppRedditApiService.redditRequest('listing', '/subreddits/mine/$where', {
				$where: 'subscriber',
				after: after,
				limit: limit
			}, function(data) {
				if (data.responseError) {
					console.log('[rpSubredditsUtilService] loadMoreUserSubreddits() ResponseError');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);

				} else {

					/*
						add the subreddits instead of replacing.
					 */
					rpSubredditsUtilService.subs = rpSubredditsUtilService.subs.concat(data.get.data.children);

					/*
						end case.
						we have all the subreddit.
					 */
					if (data.get.data.children.length < limit) {
						$rootScope.$emit('subreddits_updated');
						updateSubscriptionStatus();
						callback(null, data);

					} else { //dont have all the subreddits yet. recurse to get more.
						loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);

					}

				}
			});
		}

		function loadDefaultSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadDefaultSubreddits()');

			rpAppRedditApiService.redditRequest('listing', '/subreddits/$where', {
				$where: 'default',
				limit: limit
			}, function(data) {
				if (data.responseError) {
					console.log('[rpSubredditsUtilService] err');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					console.log('[rpSubredditsUtilService] loadDefaultSubreddits(), data.get.data.children.length: ' +
						data.get.data.children.length);

					rpSubredditsUtilService.subs = data.get.data.children;
					$rootScope.$emit('subreddits_updated');
					updateSubscriptionStatus();
					callback(null, data);
				}

			});

		}

		rpSubredditsUtilService.subscribeCurrent = function(callback) {
			console.log('[rpSubredditsUtilService] subscribeCurrent(), currentSub: ' + rpSubredditsUtilService.currentSub);

			var action = rpSubredditsUtilService.subscribed ? 'unsub' : 'sub';

			rpAppRedditApiService.redditRequest('post', '/api/subscribe', {
				action: action,
				sr: rpSubredditsUtilService.about.data.name
			}, function(data) {

				if (data.responseError) {
					console.log('[rpSubredditsUtilService] err');
					callback(data, null);
				} else {

					rpSubredditsUtilService.updateSubreddits(function(err, data) {
						if (err) {
							console.log('[rpSubredditsUtilService] err');
							callback(data, null);
						} else {
							callback(null, data);
						}

					});

				}
			});

		};

		/*
			Called from search results,
			where we need to subscribe to a subreddit that is not the current subreddit.
		 */

		rpSubredditsUtilService.subscribe = function(action, name, callback) {
			console.log('[rpSubredditsUtilService], subscribe(), action: ' + action + ", name: " + name);

			if (rpAppAuthService.isAuthenticated) {

				rpAppRedditApiService.redditRequest('post', '/api/subscribe', {
					action: action,
					sr: name
				}, function(data) {

					if (data.responseError) {
						console.log('[rpSubredditsUtilService] err');
						callback(data, null);
					} else {
						rpSubredditsUtilService.updateSubreddits(function(err, data) {
							if (err) {
								console.log('[rpSubredditsUtilService] err');
								callback(data, null);
							} else {
								callback(null, data);
							}
						});

					}

				});

			} else {
				rpToastService("you must log in to subscribe to subreddits", "sentiment_neutral");

			}

		};

		rpSubredditsUtilService.isSubscribed = function(sub) {
			console.log('[rpSubredditsUtilService] isSubscribed(), sub: ' + sub);
			return isSubscribed(sub);
		};

		function isSubscribed(sub) {

			if (typeof sub === 'undefined') {
				sub = rpSubredditsUtilService.currentSub;
			}

			console.log('[rpSubredditsUtilService] isSubscribed, rpSubredditsUtilService.subs.length: ' + rpSubredditsUtilService.subs.length);
			if (rpSubredditsUtilService.subs.length > 0 && sub !== "") {

				for (var i = 0; i < rpSubredditsUtilService.subs.length; i++) {

					if (rpSubredditsUtilService.subs[i].data.display_name.toLowerCase() === sub.toLowerCase()) {
						console.log('[rpSubredditsUtilService] isSubscribed(), true');
						return true;
					}
				}

				console.log('[rpSubredditsUtilService] isSubscribed(), false');
				return false;

			} else {

				console.log('[rpSubredditsUtilService] isSubscribed(), returning null, rpSubredditsUtilService.subs.length: ' +
					rpSubredditsUtilService.subs.length + ", sub: " + sub);

				return null;

			}
		}

		function updateSubscriptionStatus() {

			console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), ' + rpSubredditsUtilService.subs.length + ", " + rpSubredditsUtilService.currentSub);

			var prevSubStatus = rpSubredditsUtilService.subscribed;
			rpSubredditsUtilService.subscribed = isSubscribed();


			if (rpSubredditsUtilService.subscribed !== prevSubStatus) {
				console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), rpSubredditsUtilService.subscribed: ' + rpSubredditsUtilService.subscribed);
				$rootScope.$emit('subscription_status_changed', rpSubredditsUtilService.subscribed);
			}

		}

		rpSubredditsUtilService.aboutSub = function(sub, callback) {
			console.log('[rpSubredditsUtilService] aboutSub(), sub: ' + sub);
			callback(loadSubredditAbout(sub));
		};

		function loadSubredditAbout(sub) {
			// console.log('[rpSubredditsUtilService] loadSubredditAbout()');

			sub = angular.isDefined(sub) ? sub : rpSubredditsUtilService.currentSub;

			rpAppRedditApiService.redditRequest('get', '/r/$sub/about.json', {
				$sub: sub
			}, function(data) {

				if (data.responseError) {
					console.log('[rpSubredditsUtilService] loadSubredditsAbout(), err');

				} else {
					console.log('[rpSubredditsUtilService] loadSubredditsAbout, data.data.name: ' + data.data.name);
					// console.log('[rpSubredditsUtilService] loadSubredditsAbout, data: ' + JSON.stringify(data));

					if (sub === rpSubredditsUtilService.currentSub) {
						rpSubredditsUtilService.about = data;
						$rootScope.$emit('subreddits_about_updated');
						$rootScope.$emit('rp_description_change', rpSubredditsUtilService.about.data.public_description);

					}

					return data;
				}

			});

		}

		return rpSubredditsUtilService;

	}

]);

rpUtilServices.factory('rpPostsUtilService', [
	'$rootScope',
	'rpPostsResourceService',
	'rpFrontpageResourceService',
	'rpToastService',
	'rpAppLocationService',
	'rpAppRedditApiService',

	function(
		$rootScope,
		rpPostsResourceService,
		rpFrontpageResourceService,
		rpToastService,
		rpAppLocationService,
		rpAppRedditApiService

	) {

		return function(sub, sort, after, t, limit, callback) {

			console.log('[rpPostsUtilService] limit: ' + limit);

			if (sub) {


				rpAppRedditApiService.redditRequest('listing', 'r/$subreddit/$sort', {
					$subreddit: sub,
					t: t,
					limit: limit,
					after: after,
					$sort: sort
				}, function(data) {

					console.log('[rpPostsUtilService] data: ' + data);

					if (data.responseError) {

						console.log('[rpPostsUtilService] responseError data.status: ' + data.status);

						/*
						Random.
						Redirect to new sub
						*/

						// console.log('[rpPostsUtilService] error data: ' + JSON.stringify(data));

						if (data.status === 302) {

							var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
							var groups = randomSubRe.exec(data.body);

							if (groups[1]) {
								console.log('[rpPostsUtilService] open random sub: ' + groups[1]);
								rpAppLocationService(null, '/r/' + groups[1], '', true, true);

							}

						} else {
							rpToastService("something went wrong retrieving posts", "sentiment_dissatisfied");
							rpAppLocationService(null, '/error/' + data.status, '', true, true);
							callback(data, null);
						}

					} else {

						if (sub === 'random') {
							console.log('[rpPostsUtilService] random subreddit, redirecting to ' + data.get.data.children[0].data.subreddit);
							rpAppLocationService(null, '/r/' + data.get.data.children[0].data.subreddit, '', true, true);

						} else {
							console.log('[rpPostsUtilService] no err returning posts to controller, sub: ' + sub);
							callback(null, data);

						}


					}

				});





			} else {

				rpAppRedditApiService.redditRequest('listing', '/$sort', {
					$sort: sort,
					after: after,
					limit: limit,
					t: t
				}, function(data) {

					if (data.responseError) {
						rpToastService("something went wrong retrieving posts", "sentiment_dissatisfied");
						rpAppLocationService(null, '/error/' + 404, '', true, true);
						// rpAppLocationService(null, '/error/' + data.status, '', true, true);

						callback(data, null);

					} else {
						callback(null, data);

					}
				});

			}

		};
	}
]);

rpUtilServices.factory('rpMessageUtilService', ['rpAppRedditApiService', 'rpToastService',
	function(rpAppRedditApiService, rpToastService) {

		return function(where, after, limit, callback) {
			console.log('[rpMessageUtilService] request messages.');

			rpAppRedditApiService.redditRequest('listing', '/message/$where', {
				$where: where,
				after: after,
				limit: limit

			}, function(data) {

				if (data.responseError) {
					rpToastService("something went wrong retrieving your messages", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};
	}
]);

rpUtilServices.factory('rpCommentsUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(subreddit, article, sort, comment, context, callback) {
			console.log('[rpCommentsUtilService] request comments');
			console.log('[rpCommentsUtilService] subreddit: ' + subreddit);
			console.log('[rpCommentsUtilService] article: ' + article);
			console.log('[rpCommentsUtilService] sort: ' + sort);
			console.log('[rpCommentsUtilService] comment: ' + comment);
			console.log('[rpCommentsUtilService] context: ' + context);

			var params = {
				$subreddit: subreddit,
				$article: article,
				comment: comment,
				context: context,
				showedits: true,
				showmore: true,
				sort: sort,
			};

			if (angular.isUndefined(comment) || comment === "") {
				params.depth = 7;
			}
			console.log('[rpCommentsUtilService] depth: ' + params.depth);

			rpAppRedditApiService.redditRequest('get', '/r/$subreddit/comments/$article', params,
				function(data) {

					if (data.responseError) {
						console.log('[rpCommentUtilService] responseError: ' + JSON.stringify(data));
						callback(data, null);
					} else {
						callback(null, data);
					}

				});

		};
	}
]);

rpUtilServices.factory('rpMoreChildrenUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(sort, link_id, children, callback) {
			console.log('[rpMoreChildrenUtilService] request more children');

			rpAppRedditApiService.redditRequest('get', '/api/morechildren', {
				sort: sort,
				link_id: link_id,
				children: children
			}, function(data) {

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});
		};
	}
]);



rpUtilServices.factory('rpUserUtilService', ['rpAppRedditApiService', 'rpToastService',
	function(rpAppRedditApiService, rpToastService) {
		return function(username, where, sort, after, t, limit, callback) {
			console.log('[rpUserUtilService] request user');

			rpAppRedditApiService.redditRequest('listing', '/user/$username/$where', {
				$username: username,
				$where: where,
				sort: sort,
				after: after,
				t: t,
				limit: limit
			}, function(data) {
				if (data.responseError) {
					rpToastService("something went wrong retrieving the user's posts", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};
	}
]);

rpUtilServices.factory('rpAppRedditApiService', ['rpByIdResourceService',
	function(rpAppRedditApiService) {
		return function(name, callback) {
			rpAppRedditApiService.redditRequest('get', '/by_id/$name', {
				$name: name
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
]);

rpUtilServices.factory('rpReadAllMessagesUtilService', ['$timeout', 'rpAppRedditApiService',
	function($timeout, rpAppRedditApiService) {
		return function(callback) {

			var retryAttempts = 9;
			var wait = 2000;

			attemptReadAllMessages();

			function attemptReadAllMessages() {

				if (retryAttempts > 0) {

					$timeout(rpAppRedditApiService.redditRequest('post', '/api/read_all_messages', {}, function(data) {
						if (data.responseError) {
							retryAttempts -= 1;
							attemptReadAllMessages();
							callback(data, null);
						} else {
							retryAttempts = 3;
							callback(null, data);
						}
					}), wait * 10 - retryAttempts);

				}
			}
		};
	}
]);

rpUtilServices.factory('rpReadMessageUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(message, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/read_message', {
				id: message
			}, function(data) {
				if (data.responseError) {
					console.log('[rpReadMessageUtilService] err');
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};

	}
]);