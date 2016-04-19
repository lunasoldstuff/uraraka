'use strict';

var rpCommentControllers = angular.module('rpCommentControllers', []);


rpCommentControllers.controller('rpCommentCtrl', [
    '$scope',
    '$rootScope',
    '$element',
    '$compile',
    '$filter',
    '$timeout',
    'rpMoreChildrenUtilService',
    'rpIdentityUtilService',
    'rpAuthUtilService',
    'rpCommentsUtilService',

    function(
        $scope,
        $rootScope,
        $element,
        $compile,
        $filter,
        $timeout,
        rpMoreChildrenUtilService,
        rpIdentityUtilService,
        rpAuthUtilService,
        rpCommentsUtilService

    ) {

        // console.log('[rpCommentCtrl]');

        /**
         * Set state variables used in the view.
         */
        // $scope.depth = $scope.comment.depth;
        $scope.thisController = this;
        $scope.isDeleted = $scope.comment && $scope.comment.data.author !== undefined && $scope.comment.data.body !== undefined &&
            $scope.comment.data.author === '[deleted]' && $scope.comment.data.body === '[deleted]';
        $scope.childDepth = $scope.depth + 1;
        $scope.isChildrenCollapsed = false;
        $scope.isLoadingMoreChildren = false;
        $scope.isMine = $scope.identity ? $scope.comment.data.author === $scope.identity.name : false;
        $scope.isFocussed = $scope.cid === $scope.comment.data.id;
        $scope.isOp = $scope.post ? $scope.comment.data.author === $scope.post.data.author : false;
        $scope.isComment = $scope.comment.kind === 't1';
        $scope.isShowMore = $scope.comment.kind === 'more' && $scope.comment.data.count > 0;
        $scope.isContinueThread = $scope.comment.kind === 'more' && $scope.comment.data.count === 0 && $scope.comment.data.children.length > 0;
        $scope.currentComment = $scope.comment;

        $scope.hasChildren = function() {
            return $scope.comment.data.replies !== undefined &&
                $scope.comment.data.replies !== '' &&
                $scope.comment.data.replies.data.children.length !== 0;
        };

        // $scope.comment.addChildren = function(children) {
        //
        // 	// console.log('[rpCommentCtrl] $scope.comment.addChildren, $scope.hasChildren: ' + $scope.hasChildren());
        // 	//Attaching new children to an existing comment!
        // 	//Need to change the hasChildren value of the parent comment!
        // 	if (!$scope.hasChildren()) {
        // 		$scope.comment.data.replies = {
        // 			data: {
        // 				children: []
        // 			}
        // 		};
        // 	}
        //
        // 	$timeout(function() {
        // 		$scope.comment.data.replies.data.children.push(children);
        // 	}, 0);
        //
        // };

        /**
         * DIRECTIVES CTRL API
         * */

        $scope.thisController = this;

        this.completeReplying = function(data, post) {

            this.isReplying = false;

            console.log('[rpCommentCtrl] this.completeReplying()');

            if (!$scope.comment.data.replies) {

                $scope.childDepth = $scope.depth + 1;

                $scope.comment.data.replies = {

                    data: {
                        children: data.json.data.things
                    }

                };

                $scope.hasChildren = true;

            } else {

                if ($scope.isChildrenCollapsed === true) {
                    $scope.expandChildren();
                }

                $scope.comment.data.replies.data.children.unshift(data.json.data.things[0]);

            }
        };

        this.completeDeleting = function(id) {
            console.log('[rpCommentCtrl] this.completeDelete()');
            this.isDeleting = false;
            $scope.isDeleted = true;

        };

        this.completeEditing = function() {
            console.log('[rpCommentCtrl] this.completeEdit()');
            var thisController = this;
            reloadComment(function() {
                thisController.isEditing = false;
            });
        };

        /**
         * SCOPE FUNCTIONS
         * */

        $scope.collapseChildren = function() {
            $timeout(function() {
                $scope.isChildrenCollapsed = true;

            }, 300);
        };

        $scope.expandChildren = function() {
            $timeout(function() {
                $scope.isChildrenCollapsed = false;

            }, 300);
        };

        $scope.showMore = function() {
            // $scope.isDeleted = true;
            $scope.isLoadingMoreChildren = true;

            if (!$scope.sort) {
                $scope.sort = 'confidence';

            }

            // console.log('[rpCommentCtrl] showMore(), sort: ' + $scope.sort);
            // console.log('[rpCommentCtrl] showMore(), link_id: ' + $scope.post.data.name);
            // console.log('[rpCommentCtrl] showMore(), children: ' + $scope.comment.data.children.join(","));

            rpMoreChildrenUtilService($scope.sort, $scope.post.data.name, $scope.comment.data.children.join(","),
                function(err, data) {
                    $scope.isLoadingMoreChildren = false;

                    if (err) {
                        console.log('[rpCommentCtrl] err loading more children.');
                    } else {

                        if (data.json.data.things.length > 0) {
                            var children = new Array(0);
                            children[0] = data.json.data.things[0];

                            console.log('[rpCommentCtrl] showmore, data: ' + JSON.stringify(data));
                            console.log('[rpCommentCtrl] showmore, children[0].length: ' + children[0].length);

                            for (var i = 1; i < data.json.data.things.length; i++) {
                                console.log('[rpCommentCtrl] do you even for loop bro: ' + i);

                                children = insertComment(data.json.data.things[i], children);

                                if (data.json.data.things[i].data.parent_id === $scope.comment.data.parent_id) {
                                    // console.log('[rpCommentCtrl] top level comment detected: ' + data.json.data.things[i].data.name);
                                    children.push(data.json.data.things[i]);

                                }
                            }

                            if ($scope.parent.data && $scope.parent.data.replies && $scope.parent.data.replies !== '' && $scope.parent.data.replies.data.children.length > 1) {
                                console.log('[rpCommentCtrl] replcae showmore and add showmore children tree to parent');
                                var index = 0;

                                for (; index < $scope.parent.data.replies.data.children.length; index++) {
                                    console.log('[rpCommentCtrl] showmore, replacing showmore, $scope.parent.data.replies.data.children[index].data.name: ' + $scope.parent.data.replies.data.children[index].data.name);
                                    console.log('[rpCommentCtrl] showmore, replacing showmore, $scope.comment.data.name: ' + $scope.comment.data.name);

                                    if ($scope.parent.data.replies.data.children[index].data.name === $scope.comment.data.name) {
                                        break;

                                    }
                                }
                                console.log('[rpCommentCtrl] showmore, replacing showmore, index: ' + index);
                                $scope.parent.data.replies.data.children.splice.apply($scope.parent.data.replies.data.children, [index, 1].concat(children));

                                // $scope.parent.data.replies.data.children.pop();
                                // $scope.parent.data.replies.data.children = $scope.parent.data.replies.data.children.concat(children);
                            } else {
                                console.log('[rpCommentCtrl] replace parent children with showmore children tree');
                                $scope.parent.data.replies = {
                                    data: {
                                        children: children
                                    }
                                };
                            }

                        } else {
                            console.log('[rpCommentCtrl] showmore, no comments returned, pop the showmore');
                            $scope.parent.data.replies.data.children.pop();
                        }


                    }
                }
            );
        };


        function reloadComment(callback) {
            console.log('[rpCommentCtrl] reloadComment()');

            rpCommentsUtilService(
                $scope.comment.data.subreddit,
                $filter('rp_name_to_id36')($scope.comment.data.link_id),
                'hot',
                $scope.comment.data.id,
                0,
                function(err, data) {
                    if (err) {
                        console.log('[rpCommentCtrl] err');
                    } else {
                        console.log('[rpCommentCtrl] reloadComment(), data: ' + JSON.stringify(data));
                        $scope.comment = data[1].data.children[0];
                        $scope.isEditing = false;

                        if (callback) {
                            callback();
                        }

                    }

                }
            );
        }

    }

]);

function insertComment(insert, children) {

    for (var i = 0; i < children.length; i++) {


        if (insert.data.parent_id === children[i].data.name) {

            if (children[i].data.replies && children[i].data.replies !== '') {
                children[i].data.replies.data.children.push(insert);
            } else {
                children[i].data.replies = {
                    data: {
                        children: [insert]
                    }
                };
            }

        } else if (insert.data.name === children[i].data.parent_id) {

            insert.data.replies = {
                data: {
                    children: [children[i]]
                }
            };

            children.splice(i, 1);

            children.push(insert);

        } else {

            if (children[i].data.replies && children[i].data.replies !== '') {
                children[i].data.replies.children = insertComment(insert, children[i].data.replies.data.children);
            }

        }
    }

    return children;
}