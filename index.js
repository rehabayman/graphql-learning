require('dotenv').config();
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
const PORT = process.env.PORT || 5500;
const {
    authors,
    books
} = require('./data/authorsBooksData');


const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents an author",
    fields: () => ({
        // we're defining fields as a function returning an object instead of returning an object
        // is because AuthorType and BookType reference each other so when they're in a function 
        // they're defined at the very begining of the program and we are not going to run through
        // reference problems (eg. BookType should be defined before AuthorType and vice versa)
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
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
        book: {
            type: BookType,
            description: "A single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of all books",
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: "A single author",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all authors",
            resolve: () => authors
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add new book",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { 
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }

                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "Add new author",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const author = { 
                    id: authors.length + 1,
                    name: args.name
                }

                authors.push(author);
                return author;
            } 
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));