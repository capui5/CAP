sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
  ],
  function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("empreg.controller.Dataanalyticslist", {
      onInit: function () {
        this.oList = this.byId("employeelist");
        this.oDataModel = this.getOwnerComponent().getModel();
        this.getView().setModel(this.oDataModel);
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
          this.getRouter().navTo("View1", {}, true);
        }
      },
      //nav back end//
      //search start//
      onAdvancedSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue");
        var oList = this.getView().byId("employeelist");
        var oBinding = oList.getBinding("items");
        if (oBinding) {
          var aFilters = [];
          var sNormalizedQuery = sQuery.toLowerCase();
          var aSearchData = [
            {
              term: [
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "capm",
              ],
              matches: [
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "capm",
              ],
            },
            { term: ["javascript"], matches: ["react", "node.js"] },
            { term: ["azure"], matches: ["devops", "aws", "azure"] },
            {
              term: ["frontend developer"],
              matches: [
                "html",
                "css",
                "Angular",
                "Fullstack",
                "react.js",
                "vue.js",
                "javascript",
                "wordpress",
                "Fiori",
              ],
            },
            {
              term: ["backend developer"],
              matches: [
                "ABAP",
                "node js",
                "java",
                "Fullstack",
                "python",
                "c",
                "capm",
                "cap",
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "sql",
                "hana database",
                "php",
              ],
            },
            { term: ["data science"], matches: ["Phyton", "Data engineer"] },
            {
              term: ["solution Architect"],
              matches: ["agile", "cloud computing"],
            },

            // Add more terms as needed
          ];
          aSearchData.forEach(function (searchItem) {
            if (searchItem.term.includes(sNormalizedQuery)) {
              searchItem.matches.forEach(function (match) {
                var oFilter = new sap.ui.model.Filter({
                  path: "skills",
                  operator: sap.ui.model.FilterOperator.Contains,
                  value1: match,
                  caseSensitive: false,
                });
                aFilters.push(oFilter);
              });
            }
          });
          if (aFilters.length === 0) {
            // Only apply the regular search if no specific term match is found
            var oRegularFilter = new sap.ui.model.Filter({
              path: "skills",
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery,
              caseSensitive: false,
            });
            aFilters.push(oRegularFilter);
          }
          var oFNameFilter = new sap.ui.model.Filter({
            path: "fname",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          var oLNameFilter = new sap.ui.model.Filter({
            path: "lname",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          var oDesigFilter = new sap.ui.model.Filter({
            path: "desig",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          var oEmailFilter = new sap.ui.model.Filter({
            path: "email",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          var oCountryFilter = new sap.ui.model.Filter({
            path: "country/name",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          aFilters.push(
            oFNameFilter,
            oLNameFilter,
            oDesigFilter,
            oEmailFilter,
            oCountryFilter
          );
          var combinedFilter = new sap.ui.model.Filter({
            filters: aFilters,
            and: false, // All filters must match for the condition to be met
          });
          oBinding.filter(combinedFilter);
        }
      },
      //search end//
      //Add new employee start//
      onaddnewemployee: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View5");
      },
      //Add new employee end//
      //Binding data//
      onListItemPress: function (e) {
        var listItem = e.getSource();

        if (listItem) {
          var bindingContext = listItem.getBindingContext("MainModel");
          if (bindingContext) {
            var employeeId = bindingContext.getProperty("ID");
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("View6", { SEmployeeId: employeeId });
          } else {
            console.error("Binding context is not available.");
          }
        } else {
          console.error("List item is not available.");
        }
      },
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
            
            return loadImage(employeeImageUrl)
                .then(function (image) {
                    return image || (gender === 'Male' ? defaultMaleImage : defaultFemaleImage);
                });
        }
    
        // If employeeID is not available, return the default image based on gender
        return gender === 'Male' ? defaultMaleImage : defaultFemaleImage;
    },    
    //Image//
      //Log out//
      onLogout: function () {
        window.location.href = "/do/logout";
      },
      //Log out end//
      // handleSelectionChange: function (oEvent) {
      //   try {
      //     var oModel = this.getView().getModel("MainModel");

      //     if (!oModel) {
      //       console.error("Model not found.");
      //       return;
      //     }

      //     var oMultiComboBox = oEvent.getSource();
      //     var aSelectedItems = oMultiComboBox.getSelectedItems();
      //     var aSelectedSkills = aSelectedItems.map(function (oItem) {
      //       return oItem.getKey();
      //     });

      //     console.log("Selected Skills: ", aSelectedSkills);

      //     var oList = this.getView().byId("employeelist");
      //     var oBinding = oList.getBinding("items");

      //     if (!oBinding) {
      //       console.error("Binding is undefined.");
      //       return;
      //     }

      //     var aFilters = [];

      //     // Loop through each selected skill and create a filter
      //     aSelectedSkills.forEach(function (sSkill) {
      //       if (sSkill) {
      //         console.log("Filtering for skill: " + sSkill);

      //         // Split the selected skill into individual skills
      //         var individualSkills = sSkill.split(",").map(function (skill) {
      //           return skill.trim();
      //         });

      //         // Loop through each individual skill and create a filter
      //         var skillFilters = individualSkills.map(function (individualSkill) {
      //           return new sap.ui.model.Filter({
      //             path: "skills",
      //             operator: sap.ui.model.FilterOperator.Contains,
      //             value1: individualSkill,
      //             caseSensitive: false,
      //           });
      //         });

      //         // Combine the filters for individual skills using "OR" logic
      //         var combinedFilter = new sap.ui.model.Filter(skillFilters, false);
      //         aFilters.push(combinedFilter);

      //         console.log("Added filter for skill: " + sSkill);
      //       }
      //     });

      //     console.log("Applied Filters: ", aFilters);

      //     // Combine the filters with "OR" logic
      //     if (aFilters.length > 0) {
      //       var oCombinedFilter = new sap.ui.model.Filter(aFilters, true); // true for "OR" logic
      //       oBinding.filter(oCombinedFilter);
      //     } else {
      //       // If no filters are selected, clear the filter
      //       oBinding.filter([]);
      //     }

      //     // Manually refresh the binding
      //     oList.getBinding("items").refresh();
      //     oModel.refresh();

      //     console.log("Combined Filter: ", oCombinedFilter);
      //   } catch (error) {
      //     console.error("Error: ", error);
      //   }
      // },
      handleSelectionChange: function (oEvent) {
        var oMultiComboBox = oEvent.getSource();
        var aSelectedItems = oMultiComboBox.getSelectedItems();
        var aSelectedSkills = aSelectedItems.map(function (oItem) {
          return oItem.getKey();
        });

        var oList = this.getView().byId("employeelist");
        var oBinding = oList.getBinding("items");

        if (oBinding) {
          var aFilters = [];

          aSelectedSkills.forEach(function (sSkill) {
            if (sSkill) {
              var oFilter = new sap.ui.model.Filter({
                path: "skills",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sSkill,
                caseSensitive: false,
              });
              aFilters.push(oFilter);
            }
          });

          if (aFilters.length > 0) {
            var combinedFilter = new sap.ui.model.Filter({
              filters: aFilters,
              and: true, // All filters must match for the condition to be met
            });

            oBinding.filter(combinedFilter);
          } else {
            // Clear the filter when no skills are selected
            oBinding.filter([]);
          }
          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;
        }
      },

      // Handle selection finish in the MultiComboBox
      handleSelectionFinish: function (oEvent) {
        var selectedItems = oEvent.getParameter("selectedItems");

        // Check if any items are selected
        if (selectedItems.length > 0) {
          selectedItems.forEach(function (selectedItem) {
            var key = selectedItem.getKey();
            var text = selectedItem.getText();

            // Perform actions for each selected item (e.g., display key and text)
            console.log("Selected Key: " + key);
            console.log("Selected Text: " + text);
          });
        } else {
          // Handle the case where no items are selected
          console.log("No items selected.");
        }
      },
    });
  }
);