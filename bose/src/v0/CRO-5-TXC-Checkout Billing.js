(function() {

  const EXPERIMENT_PREFIX = 'exp_5';

  function track(action, optlabel = null) {

      const params = {
          'acn_eventaction': action,
          'acn_eventcategory': EXPERIMENT_PREFIX,
          'event': 'acn_experience'
      };

      if (optlabel) {
          params.acn_eventlabel = optlabel
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll("'", '');

      }

      dataLayer.push(params);
  }

  function customGoals() {
      // USER LOGGED
      var usert = window.dataLayer.map(x => x["user_type"]).find(x => x);

      // Sign in Clicks v1 
      // Should fire when a user clicks on the “sign in” CTA on the first step of checkout 
        var login = document.querySelector(".cart-login-customer-link");
        if(login!=null){
            login.addEventListener('click', () => {
                track('sign_in');
            });
        }

      // Sign in Completes V0, v1 
      // Should fire when a user successfully signs in on the cart in v0, or successfully signs in on the first step of checkout in v1 
      if(usert=='Logged in'){
          track('sign_in_complete');
      }

      // Review Your Order Clicks v0, v1 
      // Should fire when a user clicks on the “review your order” CTA below the payment. 
      var review = document.querySelector(".submit-payment");
      if(review!=null){
          review.addEventListener('click', () => {
              track('review_order');
              setTimeout(function(){
                  customGoals();
              }, 1000);
          });
      }

      // Edit Shipping Address v0, v1 
      // Should fire when a user clicks on the “edit” CTA above the shipping section 
      var editShipping = document.querySelector("#editShipping");
      if(editShipping!=null){
          editShipping.addEventListener('click', () => {
              track('edit_shipping');
          });
      }

      // Edit Cart v0, v1 
      // Should fire when a user clicks on the “edit cart” CTA next to order summary 
      var editCart = document.querySelector('#order_summary .edit-button');
      if(editCart!=null){
        editCart.addEventListener('click', () => {
              track('edit_cart');
          });
      }

      // Bug / Edit Cart on mobile navigation
      var editCartMobile = document.querySelector('#order-total-summary-modal .edit-cart-button');
      if(editCartMobile!=null){
          editCartMobile.addEventListener('click', () => {
              track('edit_cart');
          });
      }

      //Modal navigation
      var openEditCartMobile = document.querySelector('.grand-total-wrapper .btn')
      if(openEditCartMobile!=null){
          openEditCartMobile.addEventListener('click', () => {
              setTimeout(function(){
                  customGoals();
              }, 500);
          });
      }
      var editCartMobileClose = document.querySelector('#order-total-summary-modal .close');
      if(editCartMobileClose!=null){
          editCartMobileClose.addEventListener('click', () => {
              setTimeout(function(){
                  customGoals();
              }, 500);
          });
      }

  }

  function apply(context, template) {

      const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
      return Evergage.DisplayUtils
          .pageElementLoaded(contentZoneSelector)
          .then((element) => {
              const html = template(context);
              Evergage.cashDom(element).html(html);

              customGoals();

              setTimeout(function(){
                  // shippingbutton
                  var shippingbutton = document.querySelector(".submit-shipping");
                  shippingbutton.addEventListener('click', function() {
                      customGoals();
                  });
              }, 1000);
          });
  }

  function reset(context, template) {

      /** Remove the template from the DOM to reset the template. */
      Evergage.cashDom("#evg-new-template").remove();
  }

  function control(context) {

      const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
      return Evergage.DisplayUtils
          .pageElementLoaded(contentZoneSelector)
          .then((element) => {
              Evergage.cashDom(element).attr({
                  "data-evg-campaign-id": context.campaign,
                  "data-evg-experience-id": context.experience,
                  "data-evg-user-group": context.userGroup
              });
          });
  }

  registerTemplate({
      apply: apply,
      reset: reset,
      control: control
  });

})();

