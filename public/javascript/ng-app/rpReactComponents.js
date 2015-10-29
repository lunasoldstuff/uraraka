var rpReactComponents = angular.module('rpReactComponents', ['react']);

var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		name: React.PropTypes.string.isRequired,
		url: React.PropTypes.string.isRequired
	},


	render: function() {


		return React.createElement("span", null, "name: ", this.props.name, ", url: ", this.props.url);

	}

});

var SubredditsListComponent = React.createClass({displayName: "SubredditsListComponent",

	propTypes: {
		pinnedSubs: React.PropTypes.array,
	},

	render: function() {
		
		// var ngClick = this.props.ngClick;

		var createSubredditItem = function(sub, index) {

			return (
				React.createElement("md-list-item", {class: "rp-sidenav-subreddit-list-item", key: sub.name}, 
					React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 

						React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + sub.url + "')"}, sub.name)

					)
				)

			);	
		};

		return React.createElement("md-list", {className: "rp-sidenav-subreddit-list"}, this.props.pinnedSubs.map(createSubredditItem));
		// return <md-button class="rp-sidenav-subreddit-button flex" data-ng-click={this.props.ngClick}>test react ngClick</md-button>
		
	}

});


rpReactComponents.value('SubredditsComponent', SubredditsComponent);
rpReactComponents.value('SubredditsListComponent', SubredditsListComponent);