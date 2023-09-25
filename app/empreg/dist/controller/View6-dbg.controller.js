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
      handleEmailPress: function (evt) {
        var recipientEmail = "recipient@example.com";
        var subject = "Info Request";
        var body = "Hello, I would like to request some information.";

        var mailtoLink =
          "mailto:" +
          recipientEmail +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);
        window.location.href = mailtoLink;
      },
      //Email handler end //
      //Delete Start//
      onDelete: function () {
        console.log("Delete button clicked");

        var oView = this.getView();

        var oBindingContext = oView.getBindingContext("MainModel"); // Replace "MainModel" with your actual model name

        if (oBindingContext) {
          var sEmployeeIdToDelete = oBindingContext.getProperty("ID"); // Assuming "ID" is the unique identifier of an employee

          // Show a confirmation dialog

          MessageBox.confirm("Are you sure you want to delete this employee?", {
            title: "Confirm Deletion",

            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // Perform the DELETE request to delete the employee

                oBindingContext

                  .delete("$direct")

                  .then(function () {
                    // Successful deletion

                    MessageBox.success("Employee deleted successfully.", {
                      onClose: function () {
                        // Navigate to another view (e.g., "View1")

                        var oRouter =
                          sap.ui.core.UIComponent.getRouterFor(oView);

                        oRouter.navTo("View1");

                        // Reload the page (optional)

                        setTimeout(function () {
                          window.location.reload();
                        }, 10);
                      },
                    });
                  })

                  .catch(function (error) {
                    // Error during deletion

                    console.error("Error deleting employee:", error);

                    MessageBox.error("Error deleting employee.");
                  });
              }
            },
          });
        } else {
          console.error("No binding context found.");
        }
      },
      // //Delete End//

      //Image//
      formatPhoto: function (employeeID, gender) {
        console.log("Employee ID:", employeeID);
        console.log("Gender received:", gender);

        // Define the default image URLs
        var defaultMaleImage = "images/default-boy.jpg";
        var defaultFemaleImage = "images/default-girl.jpg";

        // Function to load an image and return a promise
        function loadImage(imageUrl) {
          return new Promise(function (resolve, reject) {
            var img = new Image();
            img.src = imageUrl;

            img.onload = function () {
              console.log("Image loaded successfully");
              resolve(imageUrl);
            };

            img.onerror = function () {
              console.error("Image not found, using default");
              resolve(null);
            };
          });
        }

        // If employeeID is available, construct the employee-specific image URL
        if (employeeID) {
          var employeeImageUrl = "images/" + employeeID + ".jpg";
          console.log("Employee Image URL:", employeeImageUrl);

          return loadImage(employeeImageUrl).then(function (image) {
            return (
              image ||
              (gender === "Male" ? defaultMaleImage : defaultFemaleImage)
            );
          });
        }

        // If employeeID is not available, return the default image based on gender
        return gender === "Male" ? defaultMaleImage : defaultFemaleImage;
      },
      //Image//

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
      },

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
      },
    });
  }
);
