/**
 * Processing Controller
 */
app.controller('ProcessingCtrl', ['$scope', '$rootScope', '$window', 'fdService', '$routeParams', '$location', '$anchorScroll','CONST','$timeout',
    function ($scope, $rootScope, $window, fdService, $routeParams, $location, $anchorScroll, CONST,$timeout) {

  /**
   * Init function
   * @private
   */
  var _init = function(){

    $rootScope.body_id = 'product-detail';

    $scope.id = $routeParams.id;

    //Redirect if no product Id provided
    if (!$scope.id) {
      $location.path('404');
      return;
    }

    $scope.family = [];
    $scope.faqs = [];
    $scope.features = [];

    $rootScope.cart = fdService.getCart();

    fdService.getProductOptions($scope.id)
      .success(function(data, status, headers, config) {
        $scope.family = data;
        $scope.bundle_info = {};
        $scope.bundle_info.productName = $scope.family.productName;

      })
      .error(function(data, status, headers, config) {
        $location.path('invalid-item');
      });


    fdService.getFaqs($scope.id)
      .success(function(data, status, headers, config) {
        $scope.faqs = data;
      })
      .error(function(data, status, headers, config) {
        $scope.faqs = [];
        console.log('error')
      });

    fdService.getFeatures($scope.id)
      .success(function(data, status, headers, config) {
        $scope.features = data;
      })
      .error(function(data, status, headers, config) {
        $scope.features = [];
        console.log('error')
      });

    $scope.timestamp = new Date().getTime();
    fdService.getProductsList($scope.id)
      .success(function(data, status, headers, config) {
        $scope.includes = data;
      })
      .error(function(data, status, headers, config) {
        $scope.includes = [];
        console.log('error')
      });
  };


  /**
   * Add processing product to cart
   * @param {Object} parent product
   * @param {Object} product
   */
  $scope.addToCart = function(family, product){

    var fid = family.productId;
    
    if (!Object.keys(family).length) {
      return;
    }
    var cart = fdService.getCart();
    
    if (!cart.payment_types || fid != cart.payment_types.id) {
      cart.payment_types = {
          id: fid,
          name: family.productName,
          products: {},
      };
    }
    cart.payment_types.products[product.productId] = {
        id: product.productId,
        name: product.productName,
        price: product.price,
        type: product.productType,
        term: CONST.PURCHASE_CODE,
        qty: 1,
    }

    $rootScope.cart = fdService.cartChanged(cart);
    
    fdService.validateCart($rootScope.cart)
      .success(function(data, status, headers, config) {
        $rootScope.cart.validation = data;
        $rootScope.cart = fdService.cartChanged($rootScope.cart);
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      });
    
    fdService.clearOrderId();
    fdService.updatePricing();

    //Scroll to the cart in case of small screen
    if (window.matchMedia("(max-width: 740px)").matches) {
      $timeout(function() {
        $location.hash('order-summary-container');
        $anchorScroll();
      });
    }
    
  };

  /**
   * Redirect to the checkout page
   * @param {Boolean} if true do nothing
   */
  $scope.goToCheckout = function(disabled){
    if (disabled || !$rootScope.cart.purchaseEnabled) {
      return;
    }
    $location.path('/checkout/shipping');
  };

  /**
   * Calling in case of changing cart.
   */
  $scope.cartChanged = function(){
    $rootScope.cart = fdService.cartChanged($rootScope.cart);
  };

  /**
   * Scroll to anchor
   * @param {String} anc
   */
  $scope.gotoAnchor = function(anc){
      $timeout(function() {
        $location.hash(anc);
        $anchorScroll();
      });
    };
  
  ///////////////// MAIN ////////////////////////////////
  _init();
  
}]);