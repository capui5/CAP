using {my.registration as db} from '../db/employee-sr';

service CatalogService @(path: '/CatalogService') {

    // entity Employees @(restrict :[
    //     {
    //         grant : ['READ'],
    //         to : ['EmpViewer']
    //     },
    //       {
    //         grant : ['*'],
    //         to : ['EmpAdmin']
    //     }
    // ])  as projection on db.Employees;
     entity Employees as projection on db.Employees;
    entity Department as projection on db.Department;
    entity Project    as projection on db.Project;
    entity Country    as projection on db.Country;
    // entity OnLeave    as projection on db.OnLeave;
}
