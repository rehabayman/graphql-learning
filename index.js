const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const app = express();
const PORT = 5000;
const {
    authors,
    books
} = require('./data/authorsBooksData');


const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents an author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) }
    })
});

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents a book.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { 
            // since this is not a property in the books array we need
            // to tell how to resolve this property
            type: AuthorType,
            resolve: (book) => {
                // every resolve function takes 2 parameters (parent, args)
                // parent is the object that is currently being called
                // in this case we are inside BookType thats why I named the parent parameter book
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: "List of all books",
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all authors",
            resolve: () => authors
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));