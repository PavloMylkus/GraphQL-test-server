const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql');

const schema = buildSchema(`
type Query {
    getMessage(id: ID!): Message
	messages: [Message]
  }
  
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }



  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);


class Message {
	constructor(id, { content, author }) {
		this.id = id;
		this.content = content;
		this.author = author;
	}
}

const fakeDatabase = {}

const rootValue = {
	getMessage: ({ id }) => {
		if (!fakeDatabase[id]) {
			throw new Error('no message exists with id ' + id);
		}
		return new Message(id, fakeDatabase[id]);
	},
	createMessage: ({ input }) => {
		var id = require('crypto').randomBytes(10).toString('hex');
		fakeDatabase[id] = input;
		return new Message(id, input);
	},
	updateMessage: ({ id, input }) => {
		if (!fakeDatabase[id]) {
			throw new Error('no message exists with id ' + id);
		}
		fakeDatabase[id] = input;
		return new Message(id, input);
	},
	messages: () => {
		// if (!Object.keys().length) {
		// 	return null
		// };

		return Object.keys(fakeDatabase).map((key) => {
			return new Message(key, fakeDatabase[key])
		})
	}
};

const app = express();

app.use('/graphql', graphqlHTTP({
	schema,
	rootValue,
	graphiql: true
}))

app.listen(4000);
console.log('Hello!!')