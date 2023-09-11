const cds = require('@sap/cds');
const { Employees } = cds.entities;

module.exports = cds.service.impl(function () {
  
  this.on('CREATE', Employees, async (req) => {
    
   
  });
});
