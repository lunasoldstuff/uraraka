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
 * COMMENT COMPONENT
 */
var CommentComponent = React.createClass({displayName: "CommentComponent",

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

			React.createElement("div", {className: "rp-comment rp-comment-depth" + this.props.depth}, 
				React.createElement("div", {"data-layout": "row", "data-ng-if": this.props.comment.isComment, "data-ng-class": "{'rp-comment-focussed': " + this.props.isFocussed + "}", className: "rp-comment-inner rp-comment-inner-depth" + this.props.depth}, 
					this.props.comment.kind, 
					React.createElement("div", {"data-ng-if": this.props.hasChildren, className: "rp-comment-collapse"}, 
						React.createElement("md-button", {"data-ng-click": "collapseChildren()", "aria-label": "collapse comments", "data-ng-class": "{'rp-collapse-hidden': " + this.props.childrenCollapsed + " === true}", className: "md-button rp-comment-collapse-button"}, 
							React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_arrow_drop_down_black_24px.svg", className: "rp-comment-collapse-icon"})
						), 
						React.createElement("md-button", {"data-ng-click": "expandChildren()", "aria-label": "expand comments", "data-ng-class": "{'rp-collapse-hidden': " + this.props.childrenCollapsed + " === false}", className: "md-button rp-comment-collapse-button"}, 
							React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_arrow_drop_up_black_24px.svg", className: "rp-comment-collapse-icon"})
						)
					), 
					React.createElement("div", {"data-layout": "column", "data-layout-align": "start center", "data-ng-if": !this.props.deleted, className: "rp-comment-score"}, 
						React.createElement("md-button", {id: "upvote", "aria-label": "upvote", "data-ng-click": "upvotePost()", className: "md-fab rp-post-fab"}, 
							React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_upvote_24px.svg", "data-ng-class": "{'upvoted': "+ this.props.comment.data.likes + " === true}", className: "rp-post-fab-icon"}, 
								React.createElement("md-tooltip", null, "upvote")
							)
						), React.createElement("span", {className: "rp-article-score"}, this.props.comment.data.score), 
						React.createElement("md-button", {id: "downvote", "aria-label": "downvote", "data-ng-click": "downvotePost()", className: "md-fab rp-post-fab"}, 
							React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_downvote_24px.svg", "data-ng-class": "{'downvoted': " + this.props.comment.data.likes + " === false}", className: "rp-post-fab-icon"}, 
								React.createElement("md-tooltip", null, "with great power comes great responsibility")
							)
						)
					), 
					React.createElement("div", {"data-layout": "column", className: "rp-comment-body flex"}, 
						React.createElement("div", {className: "rp-comment-title"}, 
							React.createElement("a", {"data-ng-class": "{'rp-comment-user-op': " + this.props.isOp && !this.props.deleted + "}", href: "/u/" + this.props.comment.data.author, className: "rp-comment-user"}, 
								React.createElement("span", {"data-ng-if": !this.props.deleted}, this.props.comment.data.author), 
								React.createElement("span", {"data-ng-if": this.props.deleted}, "[deleted]")
							), 
							React.createElement("span", null, "&nbsp&nbsp"), 
							React.createElement("span", {"data-am-time-ago": this.props.comment.data.created_utc, className: "rp-comment-details"}, "&nbsp&nbsp&nbsp&nbsp"), 
							React.createElement("span", {"data-ng-if": this.props.comment.data.gilded + "> 0", className: "rp-gilded"}, 
								React.createElement("md-tooltip", null, this.props.comment.data.author + " | rp_gilded_alt"), 
								React.createElement("md-button", {target: "_blank", "aria-label": "gilded", className: "md-fab rp-gilded-fab"}, 
									React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_stars_black_18px.svg", className: "rp-gilded-icon"}, 
										React.createElement("md-tooltip", null, "gilded comment")
									)
								), 
								React.createElement("span", {"data-ng-if": this.props.comment.data.gilded + " > 1", className: "rp-gilded-count"}, " &#215 ", this.props.comment.data.gilded)
							)
						), 
						
						React.createElement("div", {"data-compile": this.props.comment.data.body_html + " | rp_unescape_html | rp_load_comment_media", "data-ng-if": !this.props.deleted && !this.props.editing, className: "rp-comment-body-html"}
						), 
						
						React.createElement("div", {"data-ng-if": this.props.editing, "data-layout-padding": "data-layout-padding", className: "rp-comment-body-edit"}, 
							React.createElement("form", {name: "rpCommentEditForm", "data-ng-submit": "submit()", "data-layout": "column", "ng-controller": "rpCommentEditFormCtrl", className: "rp-comment-edit-form"}, 
								React.createElement("md-input-container", {"data-layout-padding": "data-layout-padding", className: "md-accent flex"}, 
									React.createElement("textarea", {required: "required", "data-ng-model": "editText", "aria-label": "edit post body"})
								), 
								React.createElement("div", {"data-ng-if": "!submitting", className: "rp-comment-edit-form-button-area"}, 
									React.createElement("md-button", {type: "submit", className: "md-accent md-raised rp-raised-accent"}, "Save Edit")
								), 
								React.createElement("md-progress-circular", {"data-md-mode": "indeterminate", "data-ng-if": "submitting", "data-md-diameter": "32", "data-layout-padding": "data-layout-padding", className: "md-accent"})
							)
						), 
						
						React.createElement("div", {"data-layout-padding": "data-layout-padding", "data-layout": "row", "data-layout-align": "start center", "data-ng-if": !this.props.deleted, className: "rp-comment-actions"}, 
							React.createElement("md-button", {id: "save", "aria-label": "save", "data-ng-click": "savePost()", className: "md-fab rp-post-fab"}, 
								React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_favorite_24px.svg", "data-ng-class": "{'saved': " + this.props.comment.data.saved + "}", className: "rp-post-fab-icon"}), 
								React.createElement("md-tooltip", null, "save")
							), 
							React.createElement("md-button", {id: "reply", "aria-label": "reply", "data-ng-click": "toggleReply()", className: "md-fab rp-post-fab"}, 
								React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_reply_24px.svg", "data-ng-class": "{'replying': " + this.props.showReply + "}", className: "rp-post-fab-icon"}), 
								React.createElement("md-tooltip", null, "reply")
							), 
							React.createElement("md-button", {id: "delete", "aria-label": "delete", "data-ng-click": "toggleDeleting($event)", "data-ng-if": this.props.isMine === true, className: "md-fab rp-post-fab"}, 
								React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_delete_24px.svg", "data-ng-class": "{deleting: " + this.props.deleting + "}", className: "rp-post-fab-icon"}), 
								React.createElement("md-tooltip", null, "delete")
							), 
							React.createElement("md-button", {id: "edit", "aria-label": "edit", "data-ng-click": "editComment($event)", "data-ng-if": this.props.isMine === true, className: "md-fab rp-post-fab"}, 
								React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_mode_edit_24px.svg", "data-ng-class": "{editing: " + this.props.editing + "}", className: "rp-post-fab-icon"}), 
								React.createElement("md-tooltip", null, "edit")
							), 
							React.createElement("md-button", {id: "gild", "aria-label": "gild", "data-ng-click": "gildComment($event)", "data-ng-if": this.props.isMine === false, className: "md-fab rp-post-fab"}, 
								React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_stars_24px.svg", className: "rp-post-fab-icon"}), 
								React.createElement("md-tooltip", null, "give gold")
							)
						), 
												
						React.createElement("div", {"data-layout-padding": "data-layout-padding", "data-ng-if": this.props.deleting, "data-layout": "row", "data-layout-align": "start center", className: "rp-article-delete"}, 
							React.createElement("p", {className: "rp-delete-dialog-heading"}, "Are you sure you want to delete this comment?"), 
							React.createElement("div", {"data-layout-padding": "data-layout-padding", className: "md-actions rp-delete-dialog-actions"}, 
								React.createElement("div", {"data-ng-if": !this.props.deleteProgress, className: "rp-delete-dialog-buttons"}, 
									React.createElement("md-button", {"data-ng-click": "confirmDeleteComment($event, comment)", className: "md-button md-warn"}, "Yep, Delete it")
								), 
								React.createElement("md-progress-circular", {"data-md-mode": "indeterminate", "data-ng-if": this.props.deleteProgress, "data-md-diameter": "32", className: "md-accent rp-delete-dialog-progress"})
							)
						), 
						
						React.createElement("div", {"data-layout-padding": "data-layout-padding", "data-ng-if": this.props.showReply, className: "rp-comment-reply"}, 
							React.createElement("form", {name: "rpPostReplyForm", "data-ng-submit": "postCommentReply(" + this.props.comment.data.name + ", reply)", "data-layout": "row", "data-ng-controller": "rpCommentReplyFormCtrl", className: "rp-post-reply-form"}, 
								React.createElement("md-input-container", {className: "md-accent flex"}, 
									React.createElement("label", null, "Reply to this comment"), 
									React.createElement("textarea", {"data-ng-model": "reply", required: "required", "aria-label": "comment reply"})
								), 
								React.createElement("md-button", {id: "send", "aria-label": "post reply", "data-ng-if": "reply", className: "md-fab rp-post-fab"}, 
									React.createElement("md-icon", {"data-md-svg-src": "../../icons/ic_send_24px.svg", className: "rp-post-fab-icon"}), 
									React.createElement("md-tooltip", null, "post reply")
								)
							), 
							React.createElement("div", {"ng-include": "'partials/rpFormatting'", "ng-controller": "rpFormattingCtrl", className: "rp-formatting"})
						)
					)
				), 
				
				React.createElement("div", {"data-ng-if": this.props.isShowMore, className: "rp-comment-showmore"}, 
					React.createElement("md-progress-circular", {"data-md-mode": "indeterminate", "data-ng-if": "loadingMoreChildren", "data-md-diameter": "24", className: "md-accent rp-comment-showmore-progress"}), 
					React.createElement("div", {"data-ng-if": !this.props.loadingMoreChildren, className: "rp-comment-showmore-link"}, 
						React.createElement("span", {"data-ng-click": "showMore()"}, "load ", this.props.comment.data.count, " more replies  ", React.createElement("i", {className: "mdi mdi-chevron-down"}))
					)
				), 

				React.createElement("div", {"data-ng-if": this.props.isContinueThread, className: "rp-article-continue"}, 
					React.createElement("a", {"data-ng-href": "/r/" + this.props.post.data.subreddit + "/comments/" + this.props.post.data.id + "/" + this.props.comment.data.parent_id + "| rp_name_to_id36"}, 
						React.createElement("span", {className: "rp-article-continue-link"}, "continue this thread", 
							React.createElement("t", {className: "mdi mdi-arrow-right"})
						)
					)
				)
			)
		);
	}
});

rpReactComponents.value('CommentComponent', CommentComponent);

// <rp-comment ng-repeat="comment in comment.data.replies.data.children" comment="comment" parent="::currentComment" cid="::cid" depth="::childDepth" post="::post" sort="::sort" identity="::identity"></rp-comment>
