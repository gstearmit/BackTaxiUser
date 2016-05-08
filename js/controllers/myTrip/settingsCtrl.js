App.controller('settingsCtrl', function($scope,$rootScope, $ionicModal, $timeout,$state,$ionicLoading, $ionicPopup,serv, WebService) {
	
	$scope.signUp = {};
  $scope.do_update = function( form ) {
		
		if(
				 form.$valid 
				 && $scope.signUp.pwd ==  $scope.signUp.c_pwd  
				
			){
		 
			var link = 'update_pwd';
				
			var post_data = {  
								'username'  : $rootScope.user_data.User_name ,
								'Password'  : $scope.signUp.pwd ,
								'token'  		: $rootScope.user_data.token  ,
								
							 }
			
			WebService.show_loading();	
			 
			 var promise = WebService.send_data( link,post_data);
			 
			 promise.then(function(data){  
				 
				 $ionicLoading.hide();
				 
				 form.$setPristine();
				 $scope.signUp = {};
				 
				 if(data.status == 'success'){
						
							$ionicPopup.alert({
								title: '<p class="text-center color-yellow">Thành Công</p>',
								
								template: "<p class='text-center color-gery'>Mật khẩu được cập nhật thành công</p>",
								scope: $scope					
							});
				 }
				 
			 })
		}else{
			
			form.pwd.$setDirty();
		}	
	}
});		