db.categories.update({}, {$unset:{picture: ""}}, {multi: true});
db.categories.update({}, {$rename:{categoryName: "name"}}, {multi: true});

db.customers.find().forEach(function(o){
  o.address = {
    street: o.address,
    city: o.city,
    region: o.region,
    postalCode: o.postalCode,
    country: o.country,
    phone: o.phone,
  };
  delete o.city;
  delete o.region;
  delete o.postalCode;
  delete o.country;
  delete o.phone;
  delete o.fax;
  delete o.picture;
  db.customers.save(o);
});

db.employees.find().forEach(function(o){
  o.address = {
    street: o.address,
    city: o.city,
    region: o.region,
    postalCode: o.postalCode,
    country: o.country,
    phone: o.homePhone,
  };
  delete o.city;
  delete o.region;
  delete o.postalCode;
  delete o.country;
  delete o.homePhone;
  delete o.extension;
  delete o.photo;
  delete o.photoPath;
  db.employees.save(o);
});

db.employees.find().forEach(function(o){
  o.territoryIDs = db.employee_territories.distinct('territoryID', {employeeID: o.employeeID});
  db.employees.save(o);
});

db.employee_territories.drop();

db.orders.find().forEach(function(o){
  o.shipAddress = {
    street: o.shipAddress,
    city: o.shipCity,
    region: o.shipRegion,
    postalCode: o.shipPostalCode,
    country: o.shipCountry,
  };
  delete o.shipCity;
  delete o.shipRegion;
  delete o.shipPostalCode;
  delete o.shipCountry;
  db.orders.save(o);
});

db.orders.find().forEach(function(o){
  o.details = db.order_details.find({orderID: o.orderID}, {_id:0, productID:1, unitPrice:1, quantity:1, discount:1}).toArray();
  db.orders.save(o);
});

db.order_details.drop();

db.products.find().forEach(function(o){
  o.discontinued = !!o.discontinued;
  db.products.save(o);
});
db.products.update({}, {$rename:{productName: "name"}}, {multi: true});

db.territories.update({}, {$rename:{territoryDescription: "name"}}, {multi: true});
db.regions.find().forEach(function(o){
  o.name = o.regionDescription;
  delete o.regionDescription;
  o.territories = db.territories.find({regionID: o.regionID}, {_id:0, territoryID:1, name:1}).toArray();;
  db.regions.save(o);
});
db.territories.drop();

db.suppliers.find().forEach(function(o){
  o.address = {
    street: o.address,
    city: o.city,
    region: o.region,
    postalCode: o.postalCode,
    country: o.country,
    phone: o.phone,
  };
  delete o.city;
  delete o.region;
  delete o.postalCode;
  delete o.country;
  delete o.phone;
  delete o.fax;
  delete o.homePage;
  db.suppliers.save(o);
});
