var rpReactComponents = angular.module('rpReactComponents', ['react']);

/**
 * PINNED SUBREDDITS
 */
var PinnedSubredditsComponent = React.createClass({displayName: "PinnedSubredditsComponent",
	
	propTypes: {
		name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {
		return (
			React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
				React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + this.props.url + "')"}, 
					this.props.name
				)
			)
		);
	}
});

rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);

/**
 * SUBREDDITS COMPONENT
 */
var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		display_name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {

		return (
			React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
				React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + this.props.url + "')"}, 
					this.props.display_name
				)
			)
		);	

	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);

/**
 * TEST COMMENT COMPONENT
 */
var TestCommentComponent = React.createClass({displayName: "TestCommentComponent",

	propTypes: {
		comment: React.PropTypes.object,
		depth: React.PropTypes.number,
		incrementDepth: React.PropTypes.func
	},

	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("div", null, "comment.author: ", this.props.comment.data.author), 
				React.createElement("div", null, "depth: ", this.props.depth), 
				React.createElement("button", {"data-ng-click": "$parent.incrementDepth(" + this.props.depth + ")"}, "incrementDepth()")
			)
		);
	}

});

rpReactComponents.value('TestCommentComponent', TestCommentComponent);

/**
 * COMMENT COMPONENT
 */

rpReactComponents.factory('CommentComponent', [
	'rpUpvoteUtilService',
	'rpDownvoteUtilService',

	function (rpUpvoteUtilService, rpDownvoteUtilService) {

		return React.createClass({

			propTypes: {
				comment: React.PropTypes.object.isRequired,
				depth: React.PropTypes.number,
				identityName: React.PropTypes.string,
				commentId: React.PropTypes.string,
				postAuthor: React.PropTypes.string,
			},

			getInitialState: function() {
				return {
					testValue: false,
					showReply: false,
					showChildren: true,
					showEditing: false,
					showDeleting: false,
					showLoadingMoreChildren: false
				}
			},

			componentWillMount: function() {
				this.setState({
					isMine: this.props.comment.data.author === this.props.identityName,
					isFocussed: this.props.comment.data.id === this.props.commentId,
					isAuthor: this.props.comment.data.author === this.props.postAuthor,
					isDeleted: this.props.comment.data.author !== '[deleted]' && this.props.comment.data.body === '[deleted]',
					isComment: this.props.comment.kind === 't1',
					isShowMore: this.props.comment.kind === 'more' && this.props.comment.data.count > 0,
					isContinueThread: this.props.comment.kind === 'more' && this.props.comment.data.count === 0 && this.props.comment.data.children.length > 0,
					hasChildren: this.props.comment.data.replies !== "",
				});
			},

			collapseChildren: function() {
				console.log('[CommentComponent] collapseChildren()');
				this.setState({
					showChildren: !this.state.showChildren
				})
			},

			upvote: function() {
				console.log('[CommentComponent] upvote()');
				
				rpUpvoteUtilService(this.props.comment, function(err, data) {
					console.log('[CommentComponent] upvote(), callback');
					if (err) {

					} else {

						
					}

				});
			},



			downVote: function() {
				console.log('[CommentComponent] downvote()');

				rpDownvoteUtilService(this.props.comment, function(err, data) {
					if (err) {

					} else {

					}
				});

			},

			render: function() {

				var collapseDivClass = classNames({'hidden': !this.state.hasChildren}, 'rp-comment-collapse');
				var collapseChildrenButtonClass = classNames({'rp-collapse-hidden': !this.state.showChildren}, 'rp-comment-collapse-icon');
				var showChildrenButtonClass = classNames({'rp-collapse-hidden': this.state.showChildren}, 'rp-comment-collapse-icon');
				var scoreDivClass = classNames({'hidden': this.state.isDeleted}, 'rp-comment-score');
				var upvoteButtonClass = classNames({'upvoted': this.props.comment.data.likes}, 'rp-post-fab-icon');
				var downvoteButtonClass = classNames({'downvoted': this.props.comment.data.likes === false}, 'rp-post-fab-icon');

				return (

					React.createElement("div", {className: "rp-comment rp-comment-depth" + this.props.depth}, 
						React.createElement("div", {"data-layout": "row", "data-ng-if": this.state.isComment, "data-ng-class": "{'rp-comment-focussed': " + this.state.isFocussed + "}", className: "rp-comment-inner rp-comment-inner-depth" + this.props.depth}, 
							
							React.createElement("div", {className: collapseDivClass}, 
								
								React.createElement("md-button", {onClick: this.collapseChildren, class: "rp-comment-collapse-button", "aria-label": "collapse comments"}, 
									React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_arrow_drop_down_black_24px.svg", class: collapseChildrenButtonClass}), 
									React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_arrow_drop_up_black_24px.svg", class: showChildrenButtonClass})
								)
								
							), 
							
							React.createElement("div", {"data-layout": "column", "data-layout-align": "start center", className: scoreDivClass}, 
							
								React.createElement("md-button", {id: "upvote", "aria-label": "upvote", onClick: this.upvote, class: "md-fab rp-post-fab"}, 
									React.createElement("md-icon", {"md-svg-src": "../../icons/ic_upvote_24px.svg", class: upvoteButtonClass}, 
										React.createElement("md-tooltip", null, "upvote")
									)
								), 

								React.createElement("span", {className: "rp-article-score"}, this.props.comment.data.score), 

								React.createElement("md-button", {id: "downvote", "aria-label": "downvote", onClick: this.downVote, class: "md-fab rp-post-fab"}, 
									React.createElement("md-icon", {"md-svg-src": "../../icons/ic_downvote_24px.svg", class: downvoteButtonClass}, 
										React.createElement("md-tooltip", null, "with great power comes great responsibility")
									)
								)

							), 

							React.createElement("div", null, 
								React.createElement("p", null, this.props.comment.data.author), 
								React.createElement("p", null, "pros.comments.data.likes: ", this.props.comment.data.likes ? "true" : "false"), 
								React.createElement("p", null, "state.hasChildren: ", this.state.hasChildren ? "true" : "false"), 
								React.createElement("p", null, "state.showChildren: ", this.state.showChildren ? "true" : "false"), 
								React.createElement("p", null, "state.isDeleted: ", this.state.isDeleted ? "true" : "false")
							)
						)
					)
					
				);
			}
		});
}])


// rpReactComponents.value('CommentComponent', CommentComponent);

// <rp-comment ng-repeat="comment in comment.data.replies.data.children" comment="comment" parent="::currentComment" cid="::cid" depth="::childDepth" post="::post" sort="::sort" identity="::identity"></rp-comment>

rpReactComponents.factory('TestComponent', ['rpTestUtilService', function (rpTestUtilService) {
	
	return React.createClass({

		propTypes: {
			number: React.PropTypes.number
		},

		getInitialState: function() {
			return {
				stringValue: "string value",
				numberValue: 0,

			}
		},

		incrementNumberValue: function() {

			console.log('[TestComponent] incrementNumberValue()');

			var inc = this.state.numberValue + 1;

			this.setState({
				numberValue: inc
			});

			console.log('[TestComponent] numberValue: ' + this.state.numberValue);

		},

		getNumberValue: function() {
			return this.state.numberValue;
		},

		getUtilServiceValue: function() {
			return rpTestUtilService.testValue;
		},

		componentWillMount: function() {
			this.setState({
				numberValue: this.props.number
			});
		},

		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("div", null, "prop number: ", this.props.number), 
					React.createElement("div", null, "$scope.number: ", "{{number}}"), 
					React.createElement("div", null, "state string value: ", this.state.stringValue), 
					React.createElement("div", null, "state number value: ", this.state.numberValue), 
					React.createElement("div", null, "get state number value: ", this.getNumberValue()), 
					React.createElement("div", null, "service value: ", this.getUtilServiceValue()), 
					React.createElement("div", null, "testProps.number: ", "{{testProps.number}}"), 
					React.createElement("div", null, React.createElement("button", {onClick: this.incrementNumberValue}, "increment state number value")), 
					React.createElement("div", null, React.createElement("button", {"data-ng-click": "incrementTestPropNumber()"}, "increment test prop number")), 
					React.createElement("div", null, React.createElement("button", {"data-ng-click": "incrementPropNumber("+this.props.number+")"}, "increment prop number (props.number)")), 
					React.createElement("div", null, React.createElement("button", {"data-ng-click": "incrementPropNumber(number)"}, "increment prop number (number)")), 
					React.createElement("div", null, React.createElement("button", {"data-ng-click": "multiply(2)"}, "multiply numbers"))
				)
			);
		}

	});

}]);

// rpReactComponents.directive('testComponent', function(reactDirective) {
// 	return reactDirective(TestComponent);
// });