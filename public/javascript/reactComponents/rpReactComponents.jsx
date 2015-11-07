var rpReactComponents = angular.module('rpReactComponents', ['react']);

/**
 * PINNED SUBREDDITS
 */
var PinnedSubredditsComponent = React.createClass({
	
	propTypes: {
		name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {
		return (
			<md-item-content class="rp-sidenav-subreddit-list-item-content flex">
				<md-button class="rp-sidenav-subreddit-button flex" data-ng-click={"openSubreddit($event, '" + this.props.url + "')"}>
					{this.props.name}
				</md-button>
			</md-item-content>
		);
	}
});

rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);

/**
 * SUBREDDITS COMPONENT
 */
var SubredditsComponent = React.createClass({

	propTypes: {
		display_name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {

		return (
			<md-item-content class="rp-sidenav-subreddit-list-item-content flex">
				<md-button class="rp-sidenav-subreddit-button flex" data-ng-click={"openSubreddit($event, '" + this.props.url + "')"}>
					{this.props.display_name}
				</md-button>
			</md-item-content>
		);	

	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);

/**
 * TEST COMMENT COMPONENT
 */
var TestCommentComponent = React.createClass({

	propTypes: {
		comment: React.PropTypes.object,
		depth: React.PropTypes.number,
		incrementDepth: React.PropTypes.func
	},

	render: function() {
		return (
			<div>
				<div>comment.author: {this.props.comment.data.author}</div>
				<div>depth: {this.props.depth}</div>
				<button data-ng-click={"$parent.incrementDepth(" + this.props.depth + ")"}>incrementDepth()</button>
			</div>
		);
	}

});

rpReactComponents.value('TestCommentComponent', TestCommentComponent);

/**
 * COMMENT COMPONENT
 */

rpReactComponents.factory('CommentComponent', [
	'$filter',
	'rpUpvoteUtilService',
	'rpDownvoteUtilService',

	function ($filter, rpUpvoteUtilService, rpDownvoteUtilService) {

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

			compileCommentBody: function() {
				var unescapedHTML = $filter('rp_unescape_html')(this.props.comment.data.body_html);
				var loadCommentMedia = $filter('rp_load_comment_media')(unescapedHTML);
				console.log('[CommentComponent] compileCommentBody(), loadCommentMedia: ' + loadCommentMedia);

				return $filter('rp_load_comment_media')($filter('rp_unescape_html')(this.props.comment.data.body_html));
				// return {__html: $filter('rp_load_comment_media')($filter('rp_unescape_html')(this.props.comment.data.body_html))};
			},

			CommentBodyHTML: function() {
				var unescapedHTML = $filter('rp_unescape_html')(this.props.comment.data.body_html);
				var loadCommentMedia = $filter('rp_load_comment_media')(unescapedHTML);
				console.log('[CommentComponent] compileCommentBody(), loadCommentMedia: ' + loadCommentMedia);

				return { __html: loadCommentMedia };


			},

			render: function() {

				var collapseDivClass = classNames({'hidden': !this.state.hasChildren}, 'rp-comment-collapse');
				var collapseChildrenButtonClass = classNames({'rp-collapse-hidden': !this.state.showChildren}, 'rp-comment-collapse-icon');
				var showChildrenButtonClass = classNames({'rp-collapse-hidden': this.state.showChildren}, 'rp-comment-collapse-icon');
				var scoreDivClass = classNames({'hidden': this.state.isDeleted}, 'rp-comment-score');
				var upvoteButtonClass = classNames({'upvoted': this.props.comment.data.likes}, 'rp-post-fab-icon');
				var downvoteButtonClass = classNames({'downvoted': this.props.comment.data.likes === false}, 'rp-post-fab-icon');
				var authorLinkClass = classNames({'rp-comment-user-op': this.state.isAuthor && !this.state.isDeleted}, 'rp-comment-user');
				var authorSpanClass = classNames({'hidden': this.state.deleted});
				var authorDeletedSpanClass = classNames({'hidden': !this.state.deleted});
				var gildedSpanClass = classNames({'hidden': this.props.comment.data.gilded === 0}, 'rp-gilded');
				var gildedCountSpanClass = classNames({'hidden': this.props.comment.data.gilded < 1}, 'rp-gilded-count');
				var commentBodyDivClass = classNames({'hidden': this.state.isDeleted && this.state.showEditing}, 'rp-comment-body-html')

				return (

					<div className={"rp-comment rp-comment-depth" + this.props.depth}>
						<div data-layout="row" data-ng-if={this.state.isComment} data-ng-class={"{'rp-comment-focussed': " + this.state.isFocussed + "}"} className={"rp-comment-inner rp-comment-inner-depth" + this.props.depth}>
							
							<div className={collapseDivClass}>
								
								<md-button onClick={this.collapseChildren} class="rp-comment-collapse-button" aria-label="collapse comments">
									<md-icon data-md-svg-src="../../icons/ic_arrow_drop_down_black_24px.svg" class={collapseChildrenButtonClass}></md-icon>
									<md-icon data-md-svg-src="../../icons/ic_arrow_drop_up_black_24px.svg" class={showChildrenButtonClass}></md-icon>
								</md-button>
							</div>
							
							<div data-layout="column" data-layout-align="start center" className={scoreDivClass}>
							
								<md-button id="upvote" aria-label="upvote" onClick={this.upvote} class="md-fab rp-post-fab">
									<md-icon md-svg-src="../../icons/ic_upvote_24px.svg" class={upvoteButtonClass}>
										<md-tooltip>upvote</md-tooltip>
									</md-icon>
								</md-button>

								<span className="rp-article-score">{this.props.comment.data.score}</span>

								<md-button id="downvote" aria-label="downvote" onClick={this.downVote} class="md-fab rp-post-fab">
									<md-icon md-svg-src="../../icons/ic_downvote_24px.svg" class={downvoteButtonClass}>
										<md-tooltip>with great power comes great responsibility</md-tooltip>
									</md-icon>
								</md-button>
							</div>

							<div data-layout="column" className="rp-comment-body flex">

								<div className="rp-comment-title">
									<a href={"/u/" + this.props.comment.data.author} className={authorLinkClass}> 
										<span className={authorSpanClass}>{this.props.comment.data.author}</span>
										<span className={authorDeletedSpanClass}>[deleted]</span>
									</a>
									<span>&nbsp;&nbsp;</span>
									<span data-am-time-ago={this.props.comment.data.created_utc} className="rp-comment-details">&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span className={gildedSpanClass}>
										<md-tooltip>{this.props.comment.data.author + " | rp_gilded_alt"}</md-tooltip>
										<md-button target="_blank" aria-label="gilded" class="md-fab rp-gilded-fab">
											<md-icon data-md-svg-src="../../icons/ic_stars_black_18px.svg" class="rp-gilded-icon">
												<md-tooltip>gilded comment</md-tooltip>
											</md-icon>
										</md-button>
										<span className={gildedCountSpanClass}> &#215 {this.props.comment.data.gilded}</span>
									</span>
								</div>

								<div dangerouslySetInnerHTML={this.CommentBodyHTML()} className={commentBodyDivClass} />
									

							</div>
							<div>
								<p>{this.props.comment.data.author}</p>
								<p>pros.comments.data.likes: {this.props.comment.data.likes ? "true" : "false"}</p>
								<p>state.hasChildren: {this.state.hasChildren ? "true" : "false"}</p>
								<p>state.showChildren: {this.state.showChildren ? "true" : "false"}</p>
								<p>state.isDeleted: {this.state.isDeleted ? "true" : "false"}</p>
							</div>
						</div>
					</div>
					
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
				<div>
					<div>prop number: {this.props.number}</div>
					<div>$scope.number: {"{{number}}"}</div>
					<div>state string value: {this.state.stringValue}</div>
					<div>state number value: {this.state.numberValue}</div>
					<div>get state number value: {this.getNumberValue()}</div>
					<div>service value: {this.getUtilServiceValue()}</div>
					<div>testProps.number: {"{{testProps.number}}"}</div>
					<div><button onClick={this.incrementNumberValue}>increment state number value</button></div>
					<div><button data-ng-click="incrementTestPropNumber()">increment test prop number</button></div>
					<div><button data-ng-click={"incrementPropNumber("+this.props.number+")"}>increment prop number (props.number)</button></div>
					<div><button data-ng-click={"incrementPropNumber(number)"}>increment prop number (number)</button></div>
					<div><button data-ng-click={"multiply(2)"}>multiply numbers</button></div>
				</div>
			);
		}

	});

}]);

// rpReactComponents.directive('testComponent', function(reactDirective) {
// 	return reactDirective(TestComponent);
// });