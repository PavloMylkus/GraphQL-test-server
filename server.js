const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
	type Query {
		hello: String
		otherField: Int
	}
`);

const rootValue = {
	hello: 'Hello World',
	otherField: 3
};

graphql({
	schema,
	rootValue,
	source: '{hello, otherField}'
}).then((response) => {
	console.log(response);
});