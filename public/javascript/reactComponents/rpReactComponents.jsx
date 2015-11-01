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
 * COMMENT COMPONENT
 */
var CommentComponent = React.createClass({

	propTypes: {
		comment: React.PropTypes.object,
		post: React.PropTypes.object,
		depth: React.PropTypes.number,
		isComment: React.PropTypes.bool,
		childDepth: React.PropTypes.number,
		showReply: React.PropTypes.bool,
		childrenCollapsed: React.PropTypes.bool,
		deleted: React.PropTypes.bool,
		editing: React.PropTypes.bool,
		deleting: React.PropTypes.bool,
		isMine: React.PropTypes.bool,
		isFocussed: React.PropTypes.bool,
		isOp: React.PropTypes.bool,
		isShowMore: React.PropTypes.bool,
		isContinueThread: React.PropTypes.bool,
		hasChildren: React.PropTypes.bool,
		loadingMoreChildren: React.PropTypes.bool,
		currentComment: React.PropTypes.object
	},

	render: function() {

		return (

			<div className={"rp-comment rp-comment-depth" + this.props.depth}>
				<div data-layout="row" data-ng-if={this.props.comment.isComment} data-ng-class={"{'rp-comment-focussed': " + this.props.isFocussed + "}"} className={"rp-comment-inner rp-comment-inner-depth" + this.props.depth}>
					{this.props.comment.kind}
					<div data-ng-if={this.props.hasChildren} className="rp-comment-collapse">
						<md-button data-ng-click="collapseChildren()" aria-label="collapse comments" data-ng-class={"{'rp-collapse-hidden': " + this.props.childrenCollapsed + " === true}"} className="md-button rp-comment-collapse-button">
							<md-icon data-md-svg-src="../../icons/ic_arrow_drop_down_black_24px.svg" className="rp-comment-collapse-icon"></md-icon>
						</md-button>
						<md-button data-ng-click="expandChildren()" aria-label="expand comments" data-ng-class={"{'rp-collapse-hidden': " + this.props.childrenCollapsed + " === false}"} className="md-button rp-comment-collapse-button">
							<md-icon data-md-svg-src="../../icons/ic_arrow_drop_up_black_24px.svg" className="rp-comment-collapse-icon"></md-icon>
						</md-button>
					</div>
					<div data-layout="column" data-layout-align="start center" data-ng-if={!this.props.deleted} className="rp-comment-score">
						<md-button id="upvote" aria-label="upvote" data-ng-click="upvotePost()" className="md-fab rp-post-fab">
							<md-icon data-md-svg-src="../../icons/ic_upvote_24px.svg" data-ng-class={"{'upvoted': "+ this.props.comment.data.likes + " === true}"} className="rp-post-fab-icon">
								<md-tooltip>upvote</md-tooltip>
							</md-icon>
						</md-button><span className="rp-article-score">{this.props.comment.data.score}</span>
						<md-button id="downvote" aria-label="downvote" data-ng-click="downvotePost()" className="md-fab rp-post-fab">
							<md-icon data-md-svg-src="../../icons/ic_downvote_24px.svg" data-ng-class={"{'downvoted': " + this.props.comment.data.likes + " === false}"} className="rp-post-fab-icon">
								<md-tooltip>with great power comes great responsibility</md-tooltip>
							</md-icon>
						</md-button>
					</div>
					<div data-layout="column" className="rp-comment-body flex">
						<div className="rp-comment-title">
							<a data-ng-class={"{'rp-comment-user-op': " + this.props.isOp && !this.props.deleted + "}"} href={"/u/" + this.props.comment.data.author} className="rp-comment-user"> 
								<span data-ng-if={!this.props.deleted}>{this.props.comment.data.author}</span>
								<span data-ng-if={this.props.deleted}>[deleted]</span>
							</a>
							<span>&nbsp&nbsp</span>
							<span data-am-time-ago={this.props.comment.data.created_utc} className="rp-comment-details">&nbsp&nbsp&nbsp&nbsp</span>
							<span data-ng-if={this.props.comment.data.gilded + "> 0"} className="rp-gilded">
								<md-tooltip>{this.props.comment.data.author + " | rp_gilded_alt"}</md-tooltip>
								<md-button target="_blank" aria-label="gilded" className="md-fab rp-gilded-fab">
									<md-icon data-md-svg-src="../../icons/ic_stars_black_18px.svg" className="rp-gilded-icon">
										<md-tooltip>gilded comment</md-tooltip>
									</md-icon>
								</md-button>
								<span data-ng-if={this.props.comment.data.gilded + " > 1"} className="rp-gilded-count"> &#215 {this.props.comment.data.gilded}</span>
							</span>
						</div>
						
						<div data-compile={this.props.comment.data.body_html + " | rp_unescape_html | rp_load_comment_media"} data-ng-if={!this.props.deleted && !this.props.editing} className="rp-comment-body-html">
						</div>
						
						<div data-ng-if={this.props.editing} data-layout-padding="data-layout-padding" className="rp-comment-body-edit">
							<form name="rpCommentEditForm" data-ng-submit="submit()" data-layout="column" ng-controller="rpCommentEditFormCtrl" className="rp-comment-edit-form">
								<md-input-container data-layout-padding="data-layout-padding" className="md-accent flex">
									<textarea required="required" data-ng-model="editText" aria-label="edit post body"></textarea>
								</md-input-container>
								<div data-ng-if="!submitting" className="rp-comment-edit-form-button-area">
									<md-button type="submit" className="md-accent md-raised rp-raised-accent">Save Edit</md-button>
								</div>
								<md-progress-circular data-md-mode="indeterminate" data-ng-if="submitting" data-md-diameter="32" data-layout-padding="data-layout-padding" className="md-accent"></md-progress-circular>
							</form>
						</div>
						
						<div data-layout-padding="data-layout-padding" data-layout="row" data-layout-align="start center" data-ng-if={!this.props.deleted} className="rp-comment-actions">
							<md-button id="save" aria-label="save" data-ng-click="savePost()" className="md-fab rp-post-fab">
								<md-icon data-md-svg-src="../../icons/ic_favorite_24px.svg" data-ng-class={"{'saved': " + this.props.comment.data.saved + "}"} className="rp-post-fab-icon"></md-icon>
								<md-tooltip>save</md-tooltip>
							</md-button>
							<md-button id="reply" aria-label="reply" data-ng-click="toggleReply()" className="md-fab rp-post-fab">
								<md-icon data-md-svg-src="../../icons/ic_reply_24px.svg" data-ng-class={"{'replying': " + this.props.showReply + "}"} className="rp-post-fab-icon"></md-icon>
								<md-tooltip>reply</md-tooltip>
							</md-button>
							<md-button id="delete" aria-label="delete" data-ng-click="toggleDeleting($event)" data-ng-if={this.props.isMine === true} className="md-fab rp-post-fab">
								<md-icon data-md-svg-src="../../icons/ic_delete_24px.svg" data-ng-class={"{deleting: " + this.props.deleting + "}"} className="rp-post-fab-icon"></md-icon>
								<md-tooltip>delete</md-tooltip>
							</md-button>
							<md-button id="edit" aria-label="edit" data-ng-click="editComment($event)" data-ng-if={this.props.isMine === true} className="md-fab rp-post-fab">
								<md-icon data-md-svg-src="../../icons/ic_mode_edit_24px.svg" data-ng-class={"{editing: " + this.props.editing + "}"} className="rp-post-fab-icon"></md-icon>
								<md-tooltip>edit</md-tooltip>
							</md-button>
							<md-button id="gild" aria-label="gild" data-ng-click="gildComment($event)" data-ng-if={this.props.isMine === false} className="md-fab rp-post-fab">
								<md-icon data-md-svg-src="../../icons/ic_stars_24px.svg" className="rp-post-fab-icon"></md-icon>
								<md-tooltip>give gold</md-tooltip>
							</md-button>
						</div>
												
						<div data-layout-padding="data-layout-padding" data-ng-if={this.props.deleting} data-layout="row" data-layout-align="start center" className="rp-article-delete">
							<p className="rp-delete-dialog-heading">Are you sure you want to delete this comment?</p>
							<div data-layout-padding="data-layout-padding" className="md-actions rp-delete-dialog-actions">
								<div data-ng-if={!this.props.deleteProgress} className="rp-delete-dialog-buttons">
									<md-button data-ng-click="confirmDeleteComment($event, comment)" className="md-button md-warn">Yep, Delete it</md-button>
								</div>
								<md-progress-circular data-md-mode="indeterminate" data-ng-if={this.props.deleteProgress} data-md-diameter="32" className="md-accent rp-delete-dialog-progress"></md-progress-circular>
							</div>
						</div>
						
						<div data-layout-padding="data-layout-padding" data-ng-if={this.props.showReply} className="rp-comment-reply">
							<form name="rpPostReplyForm" data-ng-submit={"postCommentReply(" + this.props.comment.data.name + ", reply)"} data-layout="row" data-ng-controller="rpCommentReplyFormCtrl" className="rp-post-reply-form">
								<md-input-container className="md-accent flex">
									<label>Reply to this comment</label>
									<textarea data-ng-model="reply" required="required" aria-label="comment reply"></textarea>
								</md-input-container>
								<md-button id="send" aria-label="post reply" data-ng-if="reply" className="md-fab rp-post-fab">
									<md-icon data-md-svg-src="../../icons/ic_send_24px.svg" className="rp-post-fab-icon"></md-icon>
									<md-tooltip>post reply</md-tooltip>
								</md-button>
							</form>
							<div ng-include="'partials/rpFormatting'" ng-controller="rpFormattingCtrl" className="rp-formatting"></div>
						</div>
					</div>
				</div>
				
				<div data-ng-if={this.props.isShowMore} className="rp-comment-showmore">
					<md-progress-circular data-md-mode="indeterminate" data-ng-if="loadingMoreChildren" data-md-diameter="24" className="md-accent rp-comment-showmore-progress"></md-progress-circular>
					<div data-ng-if={!this.props.loadingMoreChildren} className="rp-comment-showmore-link">
						<span data-ng-click="showMore()">load {this.props.comment.data.count} more replies  <i className="mdi mdi-chevron-down"></i></span>
					</div>
				</div>

				<div data-ng-if={this.props.isContinueThread} className="rp-article-continue">
					<a data-ng-href={"/r/" + this.props.post.data.subreddit + "/comments/" + this.props.post.data.id + "/" + this.props.comment.data.parent_id + "| rp_name_to_id36"}> 
						<span className="rp-article-continue-link">continue this thread
							<t className="mdi mdi-arrow-right"></t>
						</span>
					</a>
				</div>
			</div>
		);
	}
});

rpReactComponents.value('CommentComponent', CommentComponent);

// <rp-comment ng-repeat="comment in comment.data.replies.data.children" comment="comment" parent="::currentComment" cid="::cid" depth="::childDepth" post="::post" sort="::sort" identity="::identity"></rp-comment>
