
App.controller('rateCardCtrl', function($scope,$rootScope, $ionicLoading, $compile, $ionicModal,$window,$timeout,$ionicPopup,serv ) {
	
	/* JAVASCRIPT
	===========================*/
	function animate_rateCard_item(){
			$('#rateCard-tab-area').addClass('hidden');
			
			$timeout(function (){
				$('#rateCard-tab-area').removeClass('hidden');
			}, 300);
	 }	
	
	
	
	$scope.rateCard_menu = [
												{'name':'NGÀY'},
												{'name':'ĐÊM'}
											 ];
 
	//$scope.myTrip_menu_selected = 0;
	
	$scope.rateCard_menu_click = function (index){
		if( $rootScope.rateCard_menu_selected != index ){
			
			$rootScope.rateCard_menu_selected = index;
			if( index == 0 ){
				$rootScope.active_rateCard = $rootScope.All_cabs.day;
			}else if( index ==  1 ){
				$rootScope.active_rateCard = $rootScope.All_cabs.night;
			}
			animate_rateCard_item();
		}
	}
	
	

});