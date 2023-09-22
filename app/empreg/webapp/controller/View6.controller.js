sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "../model/formatter",
  ],
  function (Controller, mobileLibrary, MessageBox, Fragment, formatter) {
    "use strict";
    var URLHelper = mobileLibrary.URLHelper;
  

    return Controller.extend("empreg.controller.View6", {
      formatter: formatter,
      onInit: function () {
        this.oList = this.byId("employeelist");
        this.oDataModel = this.getOwnerComponent().getModel();
        this.getView().setModel(this.oDataModel);
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("View6")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      onNavBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("List");
      },
      _onRouteMatched: function (oEvent) {
        var oParameters = oEvent.getParameters();
        var sEmployeeId = oParameters.arguments.SEmployeeId;
        var oView = this.getView();
        var oModel = oView.getModel("MainModel");
        oView.bindElement({
          path: "/Employees/" + sEmployeeId,
          model: "MainModel",
        });
      },

      //Email handler start//
      // handleEmailPress: function (evt) {
      //     var recipientEmail = "recipient@example.com";
      //     var subject = "Info Request";
      //     var body = "Hello, I would like to request some information.";

      //     var mailtoLink = "mailto:" + recipientEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      //     window.location.href = mailtoLink;
      // },
      //Email handler end //
      //Delete Start//
      onDelete: function () {
        var oView = this.getView();
        var oEmployeePanel = oView.byId("employeePanel");
        var oList = oView.byId("employeelist");
        var that = this;
        if (oEmployeePanel) {
          var oBindingContext = oEmployeePanel.getBindingContext("MainModel");
          sap.m.MessageBox.confirm(
            "Are you sure you want to delete this employee?",
            {
              title: "Confirm Deletion",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  oBindingContext
                    .delete("$direct")
                    .then(function () {
                      sap.m.MessageBox.success(
                        "Employee deleted successfully.",
                        {
                          onClose: function () {
                            var oRouter = that.getOwnerComponent().getRouter();
                            oRouter.navTo("View1");

                            setTimeout(function () {
                              window.location.reload();
                            }, 10);
                          },
                        }
                      );
                    })
                    .catch(function (error) {
                      sap.m.MessageBox.error("Error deleting employee.");
                    });
                }
              },
            }
          );
        }
      },

      // //Delete End//


      formatPhoto: function (employeeID) {
        console.log("Employee ID:", employeeID);

        if (employeeID) {
          var employeeImageUrl = "images/" + employeeID + ".jpg";
          console.log("Employee Image URL:", employeeImageUrl);

          var img = new Image();
          img.src = employeeImageUrl;

          return new Promise(function (resolve, reject) {
            img.onload = function () {
              console.log("Image loaded successfully");
              resolve(employeeImageUrl);
            };
                                                                           
            img.onerror = function () {
              console.error("Image not found, using default");
              resolve("images/default.jpg");
            };
          });
        } else {
          console.log("Employee ID not provided, using default");
          return "images/default.jpg";
        }
      },

      onEdit: function () {
        var oView = this.getView();
        var oEditDialog = this.byId("editDialog");

        if (!oEditDialog) {
          // Dialog doesn't exist, create and initialize it
          Fragment.load({
            id: oView.getId(),
            name: "empreg.view.Edit",
            controller: this,
          })
            .then(function (oDialog) {
              oView.addDependent(oDialog);

              // Listen to the "afterClose" event and destroy the dialog
              oDialog.attachAfterClose(function () {
                oDialog.destroy();
              });

              oDialog.open();
            })
            .catch(function (error) {
              MessageBox.error("Error loading fragment: " + error);
            });
        } else {
          // Dialog already exists, just open it
          oEditDialog.open();
        }
        var oModel = oView.getModel("MainModel");
        console.log(oModel.getData());
        // var oModel = oView.getModel("MainModel");
        // if (oModel.leave == false) {
        //   this.getView()
        //     .byId("leave")
        //     .setSelected(0 / 1);
        // }
      },

      // setEmployeeData: function (oEmployee) {
      //   var oView = this.getView();

      //   // Set values for various fields based on oEmployee properties
      //   oView.byId("EmployeeId").setValue(oEmployee.ID).setEditable(false);
      //   oView.byId("fname").setValue(oEmployee.fname);
      //   oView.byId("lname").setValue(oEmployee.lname);
      //   oView.byId("desig").setValue(oEmployee.desig);
      //   oView.byId("email").setValue(oEmployee.email);
      //   oView.byId("skills").setValue(oEmployee.skills);
      //   oView.byId("country").setSelectedKey(oEmployee.country_ID);
      //   oView.byId("idstate").setValue(oEmployee.State);
      //   oView.byId("idcity").setValue(oEmployee.city);
      //   oView.byId("myDatePicker").setValue(oEmployee.doj);
      //   oView.byId("yoe").setValue(oEmployee.yoe);
      //   oView.byId("reportingPerson").setValue(oEmployee.reportingPerson);
      //   oView.byId("phonenumber").setValue(oEmployee.Phno);

      //   // Set gender based on oEmployee.gender
      //   var oGenderRadioGroup = oView.byId("genderRadioGroup");
      //   var oGenderModel = oView.getModel("MainModel");
      //   var selectedGenderIndex =
      //     oEmployee.gender.toLowerCase() === "male" ? 0 : 1;
      //   oGenderModel.setProperty("/SelectedGenderIndex", selectedGenderIndex);
      //   // Set the "Leave" dropdown based on oEmployee.leave
      //   var oLeaveSelect = oView.byId("leave");
      //   var leaveKey = oEmployee.leave ? "true" : "false";
      //   oLeaveSelect.setSelectedKey(leaveKey);
      // },

      onUpdate: function () {
        const oView = this.getView();
        const sSelectedCountry = oView
          .byId("country")
          .getSelectedItem()
          .getKey();
        const oCountryMapping = {
          Netherlands: 1,
          India: 2,
          Singapore: 3,
        };
        const nCountryValue = oCountryMapping[sSelectedCountry];
        const leave = oView.byId("leave").getSelectedKey() === "0";

        // Parse the ID and validate it
        const sEmployeeId = oView.byId("Id").getValue();
        if (!/^\d+$/.test(sEmployeeId)) {
          sap.m.MessageBox.error(
            "Invalid Employee ID. Please enter a valid number."
          );
          return;
        }

        // Format the date in YYYY-MM-DD format
        const sDoj = formatDate(oView.byId("myDatePicker").getDateValue());

        // Parse the Years of Experience as an integer
        const nYoe = parseInt(oView.byId("yoe").getValue());

        const phoneNumberInput = oView.byId("phonenumber");
        const phoneNumberValue = phoneNumberInput.getValue().replace(/,/g, "");
        const PhNo = phoneNumberValue
          ? parseFloat(phoneNumberValue.replace(/,/g, ""))
          : null;

        // Check if the parsed value is a valid number
        if (isNaN(PhNo)) {
          sap.m.MessageBox.error(
            "Invalid Phone Number. Please enter a valid number."
          );
          return;
        }

        // Define selectedGender based on the selected dropdown item key
        const genderDropdown = oView.byId("genderDropdown");
        const selectedGenderKey = genderDropdown.getSelectedKey();
        let selectedGender;

        if (selectedGenderKey === "Male") {
          selectedGender = "Male";
        } else if (selectedGenderKey === "Female") {
          selectedGender = "Female";
        } else {
          // Handle the case when an invalid gender is selected
          sap.m.MessageBox.error("Please select a valid gender.");
          return;
        }

        // Define updatedEmployee here
        const updatedEmployee = {
          ID: parseInt(sEmployeeId),
          fname: oView.byId("fname").getValue(),
          lname: oView.byId("lname").getValue(),
          desig: oView.byId("desig").getValue(),
          email: oView.byId("email").getValue(),
          skills: oView.byId("skills").getValue().toUpperCase(),
          country_ID: nCountryValue,
          State: oView.byId("idstate").getValue(),
          city: oView.byId("idcity").getValue(),
          doj: sDoj,
          yoe: nYoe,
          Phno: PhNo !== null ? PhNo.toString() : null,
          reportingPerson: oView.byId("reportingPerson").getValue(),
          gender: selectedGender, // Use the selected gender
          leave: leave,
        };

        fetch(`./CatalogService/Employees(${updatedEmployee.ID})`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        })
          .then((response) => {
            if (response.ok) {
              sap.m.MessageBox.success(
                "Employee Details Updated successfully.",
                {
                  onClose: function () {
                    window.location.reload();
                  },
                }
              );
            } else {
              throw new Error("Error updating employee data");
            }
          })
          .catch(function (error) {
            sap.m.MessageBox.error(error.message); // Use error.message to display the actual error message
          });

        // Helper function to format date as YYYY-MM-DD
        function formatDate(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      },
      onCancel: function (oEvent) {
        this.byId("openDialog").close();
      }
      
    });
  }
);