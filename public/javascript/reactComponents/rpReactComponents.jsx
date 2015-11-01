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