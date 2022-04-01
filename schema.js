const axios=require('axios');
const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, GraphQLList, GraphQLNonNull
}=require('graphql');
/*
const customers=[
    {id:'1',name:'John',email:'john@example.com',age:20},
    {id:'2',name:'Steve',email:'steve@example.com',age:25},
    {id:'3',name:'Sara',email:'sara@example.com',age:29},
];
*/
const customerType=new GraphQLObjectType({
    name: 'customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt},
    })
})

const RootQuery= new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        customer:{
            type:customerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue,args){
               /* for(let i=0;i<customers.length; i++){
                    if(customers[i].id==args.id){
                        return customers[i];
                    }
                }*/
                return axios.get('http://localhost:3000/customers/'+args.id)
                      .then(res=>res.data);
            }
        },
        customers:{
            type:new GraphQLList(customerType),
            resolve(parentValue,args){
                return axios.get('http://localhost:3000/customers')
                .then(res=>res.data);
            }
        }
    }
   
})

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields:{
        addCustomer:{
            type: customerType,
            args: {
                name:{type: new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentValue,args){
                return axios.post('http://localhost:3000/customers',{
                    name:args.name,
                    email:args.email,
                    age:args.age
                })
                .then(res=>res.data);
            }
        },
        deleteCustomer:{
            type: customerType,
            args: {
              id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res=>res.data);
            }
        },
        editCustomer:{
            type: customerType,
            args: {
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type: GraphQLString},
                email:{type: GraphQLString},
                age:{type: GraphQLInt}
            },
            resolve(parentValue,args){
                return axios.patch('http://localhost:3000/customers/'+args.id,args)
                   .then(res=>res.data);
            }
        }
    }
});

module.exports =new GraphQLSchema({
       query:RootQuery,
       mutation
});