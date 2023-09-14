sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, History) {
    "use strict";

    return Controller.extend("empreg.controller.View5", {
      onInit: function () {
        // this.oTable = this.byId("table0");
        this.oList = this.byId("employeelist");
        // var oManifest = this.getOwnerComponent().getManifest();
        //var serviceUrl = oManifest["sap.app"].dataModel.serviceUrl;
      },
      //Nav Back start//

      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      onNavBack: function () {
        var oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("View1", {}, true /*no history*/);
        }
      },
      //nav back end//
      //Create start//
      onCreate: function () {
        var that = this;


        $.ajax({
          type: "GET",

          url: "./CatalogService/Employees?$orderby=ID desc&$top=1", 

          dataType: "json",

          success: function (data) {
         

            if (data && data.value && data.value.length > 0) {
              var maxIdResult = data.value[0];

              var nextEmployeeId = maxIdResult.ID + 1;

          

              var sSelectedCountry = that
                .byId("country")
                .getSelectedItem()
                .getKey();

              var oCountryMapping = {
                Netherlands: 1,

                India: 2,

                Singapore: 3,
              };

              var nCountryValue = oCountryMapping[sSelectedCountry];

              var newEmployee = {
                ID: nextEmployeeId, // Automatically generated ID

                fname: that.byId("fname").getValue(),

                lname: that.byId("lname").getValue(),

                desig: that.byId("desig").getValue(),

                email: that.byId("email").getValue(),

                skills: that.byId("skills").getValue(),

                country_ID: nCountryValue,

                State: that.byId("idstate").getValue(),

                city: that.byId("idcity").getValue(),

                doj: that.byId("myDatePicker").getValue(),

                yoe: parseInt(that.byId("yoe").getValue()),

                reportingPerson: that.byId("reportingPerson").getValue(),

                gender: that
                  .byId("genderRadioGroup")
                  .getSelectedButton()
                  .getText(),
              };

              // Step 3: Send the new employee data to the server

              $.ajax({
                contentType: "application/json",

                type: "POST",

                url: "./CatalogService/Employees", // Adjust the URL for creating a new employee

                dataType: "json",

                data: JSON.stringify(newEmployee),

                success: function (result) {
                  MessageBox.success("Employee data saved successfully!", {
                    onClose: function () {
                      // Navigate to "View1" after the success message is closed

                      var oRouter = sap.ui.core.UIComponent.getRouterFor(that);

                      oRouter.navTo("View1");

                      window.location.reload();
                    },
                  });
                  that.clearFormFields();
                },

                error: function (response) {
                  MessageBox.error("Error while saving employee data");
                },
              });
            } else {
              MessageBox.error("Error: No employee data found.");
            }
          },

          error: function (response) {
            MessageBox.error("Error fetching the highest employee ID");
          },
        });
      },
      clearFormFields: function () {
        const fieldsToClear = [
          "Id",
          "fname",
          "lname",
          "desig",
          "email",
          "skills",
          "idstate",
          "idcity",
          "myDatePicker",
          "yoe",
          "reportingperson",
        ];

        const radioGroup = this.byId("genderRadioGroup");

        fieldsToClear.forEach((field) => {
          const fieldControl = this.byId(field);
          if (fieldControl) {
            fieldControl.setValue("");
          }
        });

        if (radioGroup) {
          radioGroup.setSelectedButton(null);
        }
      },

      onCancel: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("AllEmployees", {}, true);
        }
      },
    });
  }
);
