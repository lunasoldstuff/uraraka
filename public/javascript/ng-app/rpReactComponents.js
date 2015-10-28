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

rpReactComponents.value('SubredditsComponent', SubredditsComponent);