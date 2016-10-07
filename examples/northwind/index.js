import express from 'express';
import GraphqlSchema from './graphqlSchema';

export default {
  uri: '/northwind',
  schema: GraphqlSchema,
  title: 'Northwind: complex schema with 8 models 🌶🌶🌶',
  description: 'This is a sample data of some trading company, which consists from 8 models. All models has cross-relations to each other. This schema used in <b><a href="https://nodkz.github.io/relay-northwind/" target="_blank">Relay example app <span class="glyphicon glyphicon-new-window"></span></a></b>',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/northwind',
  queries: [
    {
      title: 'Self referenced Employee Type',
      query: `
{
  viewer {
    employeeList {
      firstName
      subordinates {
        firstName
      }
      chief {
        firstName
      }
    }
  }
}
      `
    },
    {
      title: 'OrderConnection -> OrderDetails -> Product',
      query: `
{
  viewer {
    orderConnection(first: 3) {
      count
      edges {
        node {
          orderID
          customer {
            companyName
            contactName
          }
          details {
            unitPrice
            quantity
            product {
              name
              unitsInStock
              discontinued
            }
          }
        }
      }
    }
  }
}
      `
    },
    {
      title: 'Some crazy query',
      query: `
{
  viewer {
    meatCategory: category(filter: {categoryID:6}) {
      name
      productConnection {
        edges {
          node {
            name
            supplier {
              companyName
              address {
                street
                country
                city
              }
            }
          }
        }
      }
    }
    supplier {
      supplierID
    	companyName
      contactName
      productConnection {
        count
        edges {
          node {
            name
            unitPrice
            quantityPerUnit
            category {
              name
              categoryID
              productConnection {
                count
              }
            }
          }
        }
      }
  	}
    p1: product {
      name
      id
      productID
    }
    p2: product(skip: 2) {
      name
      id
      productID
      orderConnection {
        count
        edges {
          node {
            customer {
              companyName
              contactName
        			contactTitle
              orderConnection {
                count
                edges {
                  node {
                    shipVia
                    shipper {
                      companyName
                      orderConnection(first: 1, sort: _ID_DESC) {
                        count
                        edges {
                          node {
                            freight
                      	  }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    p3: product(skip: 1) {
      name
      id
      productID
    }
    categoryList(limit: 3) {
      name
      description
      productConnection(first: 1) {
        count
        edges {
          node {
            name
            unitPrice
            discontinued
          }
        }
      }
    }
  }
}
      `
    }
  ]
};
