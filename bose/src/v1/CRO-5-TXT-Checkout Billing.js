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

  function myLoad(){
      var usert = window.dataLayer.map(x => x["user_type"]).find(x => x);

      if(usert=='Logged in'){
          window.addEventListener("load", (event) => {
              document.querySelector(".submit-shipping").click();
              setTimeout(function(){
                  visualChanges();
               }, 1000);
          });
          
      }else{
          // sign in box is printed by exp 2.0, exp 5.0 only add customGoals
          // makeLogin();
          customGoals();

          setTimeout(function(){
              // shippingbutton
              var shippingbutton = document.querySelector(".submit-shipping");
              shippingbutton.addEventListener('click', function() {
                  visualChanges();
              });
          }, 1000);
      }
  }

  function visualChanges(){
      // summary-details shipping
      var linebreak = document.createElement("br");
      var ship = document.querySelectorAll(".summary-details.shipping .address-summary div");
      for (var i = 0; i < ship.length; i++) {
          ship[i].style.display = "block";
      }

      // billing address
      var form = document.querySelector("#dwfrm_billing");

      //form
      var div = document.createElement('div');
      div.setAttribute("id", "billingAddressForm");

      form.append(div);
      // label
      var divBillAddress = document.createElement('div');
      divBillAddress.setAttribute("id", "billAddress");
      form.append(divBillAddress);
      
      // move form elements 
      var b1 = document.querySelector(".checkout-same-address-checkbox.checkbox-button-control");
      var b2 = document.querySelector(".billing-address-block");
      var b3 = document.querySelector(".save-address-billing-message");
      var b4 = document.querySelector(".save-address-billing.checkbox-button-control");

      div.append(b1);
      div.append(b2);
      if(b3!=null) div.append(b3);
      if(b4!=null) div.append(b4);

      // duplicate billing address
      var span = document.createElement('span');
      span.setAttribute("class", "summary-section-label");
      span.innerText = "Billing Address:"; 
      var shipAddress = document.querySelector(".summary-details.shipping");
      var billAddress = shipAddress.cloneNode(true);

      divBillAddress.append(span);
      divBillAddress.append(billAddress);
      
      // summary-details billing
      var ship = document.querySelectorAll(".summary-details.billing .address-summary div");
      for (var i = 0; i < ship.length; i++) {
          ship[i].style.display = "block";
      }

      // billing_form_checkbox
      var checkbox = document.querySelector("#billing_form_checkbox");
      checkbox.addEventListener('change', function() {
          if (this.checked) {
              divBillAddress.style.display = "block";
          } else {
              divBillAddress.style.display = "none";
          }
      });

      // paymentbutton
      var paymentbutton = document.querySelector(".submit-payment");
      paymentbutton.addEventListener('click', function() {
          // summary-details billing
          var ship = document.querySelectorAll(".summary-details.billing .address-summary div");
          for (var i = 0; i < ship.length; i++) {
              ship[i].style.display = "block";
          }
      });

      customGoals();

  }

  function makeLogin(){

      var section = document.querySelector('.shipping-info');
      //login section
      var div = document.createElement('div');
      div.setAttribute("id", "makeLogin");
      div.setAttribute("class", "cart-login-customer-container");

      var link = document.createElement('a');
      link.setAttribute("href", "/login?oauthProvider=Azure-AD-B2C");
      link.setAttribute("class", "cart-login-customer-link");
      link.innerText = "Sign-in";

      var p1 = document.createElement('p');
      p1.setAttribute("class", "cart-login-customer-header");
      p1.innerText = "Do you have a My Bose Account?"; 

      var p2 = document.createElement('p');
      p2.setAttribute("class", "cart-login-customer-body");
      p2.innerText = "Enjoy member benefits and faster checkout "; 
      p2.append(link);

      div.append(p1);
      div.append(p2);
      section.append(div);
  }

  function apply(context, template) {

      const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
      return Evergage.DisplayUtils
          .pageElementLoaded(contentZoneSelector)
          .then((element) => {
              const html = template(context);
              Evergage.cashDom(element).html(html);
              myLoad();
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

