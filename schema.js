const axios = require('axios')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

// Hardcode data
// const customers = [
//   { id: 1, name: 'John Doe', email: 'jdoe@gmail.com', age: 35 },
//   { id: 2, name: 'Steve Smith', email: 'smith@gmail.com', age: 25 },
//   { id: 3, name: 'Sarah Williams', email: 'swilliams@gmail.com', age: 32 }
// ]

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // for (let customer of customers) {
        //   if (customer.id == args.id) {
        //     return customer
        //   }
        // }
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return customers
        return axios.get('http://localhost:3000/customers')
          .then(res => res.data)
      }
    }
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'mutations',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age
        })
          .then(res => res.data)
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})