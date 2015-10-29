var rpReactComponents = angular.module('rpReactComponents', ['react']);

var PinnedSubredditsComponent = React.createClass({

	propTypes: {
		subs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return (
				<md-list-item class="rp-sidenav-subreddit-list-item" key={sub.name}>
					<md-item-content class="rp-sidenav-subreddit-list-item-content flex">
						<md-button class="rp-sidenav-subreddit-button flex" data-ng-click={"openSubreddit($event, '" + sub.url + "')"}>{sub.name}</md-button>
					</md-item-content>
				</md-list-item>

			);	
		};

		return <md-list className="rp-sidenav-subreddit-list">{this.props.subs.map(createSubredditItem)}</md-list>;
		
	}

});

// rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);
rpReactComponents.directive('pinnedSubredditsComponent', function(reactDirective) {
	return reactDirective(PinnedSubredditsComponent);
});

var SubredditsComponent = React.createClass({

	propTypes: {
		subs: React.PropTypes.array
	},

	render: function() {
		var createSubredditItem = function(sub, index) {

			return (
				<md-list-item class="rp-sidenav-subreddit-list-item" key={sub.data.display_name}>
					<md-item-content class="rp-sidenav-subreddit-list-item-content flex">

						<md-button class="rp-sidenav-subreddit-button flex" data-ng-click={"openSubreddit($event, '" + sub.data.url + "')"}>{sub.data.display_name}</md-button>

					</md-item-content>
				</md-list-item>

			);	
		};

		return <md-list className="rp-sidenav-subreddit-list">{this.props.subs.map(createSubredditItem)}</md-list>;
	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);