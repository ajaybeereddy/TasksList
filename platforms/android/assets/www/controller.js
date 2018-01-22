angular.module('starter.controllers', [])
    .controller('listExampleCtrl', ['ListFactory', '$scope', '$ionicModal',
        function(ListFactory, $scope, $ionicModal) {

            // Load the add / change dialog from the given template URL
            $ionicModal.fromTemplateUrl('add-change-dialog.html', function(modal) {
                $scope.addDialog = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });


            $scope.showAddChangeDialog = function(action) {
                $scope.action = action;
                $scope.addDialog.show();
            };

            $scope.leaveAddChangeDialog = function() {
                // Remove dialog 
                $scope.addDialog.remove();
                // Reload modal template to have cleared form
                $ionicModal.fromTemplateUrl('add-change-dialog.html', function(modal) {
                    $scope.addDialog = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            };

            $scope.leftButtons = [];
            var addButton = {};
            addButton.type = "button-clear";
            addButton.content = '<i class="icon ion-ios7-plus-outline"></i>';
            addButton.tap = function(e) {
                $scope.showAddChangeDialog('add');
            }
            $scope.leftButtons.push(addButton);

            // Define item buttons
            $scope.itemButtons = [{
                text: 'Delete',
                type: 'button-assertive',
                onTap: function(item) {
                    $scope.removeItem(item);
                }
            }, {
                text: 'Edit',
                type: 'button-calm',
                onTap: function(item) {
                    $scope.showEditItem(item);
                }
            }];

            // Get list from storage
            $scope.list = ListFactory.getList();

            // Used to cache the empty form for Edit Dialog
            $scope.saveEmpty = function(form) {
                $scope.form = angular.copy(form);
            }

            $scope.addItem = function(form) {
                var newItem = {};
                // Add values from form to object
                newItem.description = form.description.$modelValue;
                newItem.name = form.name.$modelValue;
                if (newItem.name == undefined && newItem.description == undefined) {
                    alert("All fields are mandatory");
                    return false;
                }
                // newItem.useAsDefault = form.useAsDefault.$modelValue;
                // If this is the first item it will be the default item
                if ($scope.list.length == 0) {
                    newItem.useAsDefault = true;
                } else {
                    // Remove old default entry from list	
                    if (newItem.useAsDefault) {
                        removeDefault();
                    }
                }
                // Save new list in scope and factory
                $scope.list.push(newItem);
                ListFactory.setList($scope.list);
                // Close dialog
                $scope.leaveAddChangeDialog();
            };

            $scope.removeItem = function(item) {
                // Search & Destroy item from list
                $scope.list.splice($scope.list.indexOf(item), 1);
                // If this item was the Default we set first item in list to default
                if (item.useAsDefault == true && $scope.list.length != 0) {
                    $scope.list[0].useAsDefault = true;
                }
                // Save list in factory
                ListFactory.setList($scope.list);
            }

            $scope.makeDefault = function(item) {
                removeDefault();
                var newDefaultIndex = $scope.list.indexOf(item);
                $scope.list[newDefaultIndex].useAsDefault = true;
                ListFactory.setList($scope.list);
            }

            function removeDefault() {
                //Remove existing default
                for (var i = 0; i < $scope.list.length; i++) {
                    if ($scope.list[i].useAsDefault == true) {
                        $scope.list[i].useAsDefault = false;
                    }
                }
            }

            $scope.showEditItem = function(item) {

                // Remember edit item to change it later
                $scope.tmpEditItem = item;

                // Preset form values
                $scope.form.description.$setViewValue(item.description);
                $scope.form.name.$setViewValue(item.name);
                // $scope.form.useAsDefault.$setViewValue(item.useAsDefault);
                // Open dialog
                $scope.showAddChangeDialog('change');
            };

            $scope.editItem = function(form) {

                var item = {};
                item.description = form.description.$modelValue;
                item.name = form.name.$modelValue;
                // item.useAsDefault = form.useAsDefault.$modelValue;

                var editIndex = ListFactory.getList().indexOf($scope.tmpEditItem);
                $scope.list[editIndex] = item;
                // Set first item to default
                if ($scope.tmpEditItem.useAsDefault == true && item.useAsDefault == false) {
                    $scope.list[0].useAsDefault = true;
                }

                ListFactory.setList($scope.list);
                if (item.useAsDefault) {
                    $scope.makeDefault(item);
                }

                $scope.leaveAddChangeDialog();
            }

        }
    ]);