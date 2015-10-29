var rpReactComponents = angular.module('rpReactComponents', ['react']);

var SubredditsComponent = React.createClass({

	propTypes: {
		name: React.PropTypes.string.isRequired,
		url: React.PropTypes.string.isRequired
	},


	render: function() {


		return <span>name: {this.props.name}, url: {this.props.url}</span>;

	}

});

var PinnedSubredditsComponent = React.createClass({

	propTypes: {
		pinnedSubs: React.PropTypes.array,
	},

	render: function() {
		
		// var ngClick = this.props.ngClick;

		var createSubredditItem = function(sub, index) {

			return (
				<md-list-item class="rp-sidenav-subreddit-list-item" key={sub.name}>
					<md-item-content class="rp-sidenav-subreddit-list-item-content flex">

						<md-button class="rp-sidenav-subreddit-button flex" data-ng-click={"openSubreddit($event, '" + sub.url + "')"}>{sub.name}</md-button>

					</md-item-content>
				</md-list-item>

			);	
		};

		return <md-list className="rp-sidenav-subreddit-list">{this.props.pinnedSubs.map(createSubredditItem)}</md-list>;
		// return <md-button class="rp-sidenav-subreddit-button flex" data-ng-click={this.props.ngClick}>test react ngClick</md-button>
		
	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);
rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);