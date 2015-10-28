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

rpReactComponents.value('SubredditsComponent', SubredditsComponent);