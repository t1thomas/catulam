const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema } = require('neo4j-graphql-js');

const idListScalar = new GraphQLObjectType({
  name: 'ids',
  fields: () => ({
    ids: { type: new GraphQLList(GraphQLString) },
  }),
});
const typeDefs = `
    scalar JSON
    scalar idList

    type Project {
        id: ID!
        title: String!
        desc: String
    }

    type UserStory {
        id: ID!
        storyText: String!
        tickets: [Ticket] @relation(name: "SUB_TASK", direction: IN)
        ticketIds: idList
          @cypher(statement: """
              MATCH (this)<-[:SUB_TASK]-(rec:Ticket)
              RETURN collect(rec.id) AS ids
         """)    
    }
    type Ticket {
        id: ID!
        issueNumber: Int!
        hourEstimate: Int
        userStory: UserStory @relation(name: "SUB_TASK", direction: OUT)
        assigendTo: ID
        title: String!
        creator: String
        desc: String
        done: Boolean!
        sprint: Sprint @relation(name: "SPRINT_TASK", direction: OUT)
    }
    type Sprint {
        id: ID!
        sprintNo: Int!
        tickets: [Ticket] @relation(name: "SPRINT_TASK", direction: IN)
        userStories: [UserStory] @cypher(statement: """
            MATCH (this)<-[:SPRINT_TASK]-(:Ticket)-[r1:SUB_TASK]->(rec:UserStory)
            WITH rec, COUNT(r1) AS num ORDER BY num DESC
            RETURN rec
         """)
        ticketIds: idList
          @cypher(statement: """
              MATCH (this)<-[:SPRINT_TASK]-(rec:Ticket)
              RETURN collect(rec.id) AS ids
         """)    
    }
    type Query {
        ticketsAsMap: JSON
          @cypher (statement: """
           Match (n:Ticket)
           WITH n.id as key, apoc.map.removeKey(n {.*}, 'id')  as value 
           RETURN apoc.map.fromPairs(collect([key, value]))
        """ )
    }
    type Mutation {
          TicSwitchSprint(tickId: String!, sprintIdFrom: String!, sprintIdTo: String!): JSON
            @cypher(statement:"""
            MATCH (a:Ticket{id:tickId})-[rel:SPRINT_TASK]->(b:Sprint {id:sprintIdFrom})
            MATCH (c:Sprint {id:sprintIdTo})
            CALL apoc.refactor.to(rel, c)
            YIELD input, output, error
            RETURN input, output, error
            """)
              
          TicSwitchUStory(tickId: String!, UStoryIdFrom: String!, UStoryIdTo: String!): JSON
            @cypher(statement:"""
            MATCH (a:Ticket { id:tickId })-[rel:SUB_TASK]->(b:UserStory { id:UStoryIdFrom })
            MATCH (c:UserStory { id:UStoryIdTo })
            CALL apoc.refactor.to(rel, c)
            YIELD input, output, error
            RETURN input, output, error
            """)    
                      
          TicSprintToDone(tickId: String!, sprintId: String!): JSON
            @cypher(statement:"""
            MATCH (a:Ticket{id:tickId})-[rel:SPRINT_TASK]->(b:Sprint)
            DELETE rel
            SET a.done = true
            RETURN a.id, a.done
            """)
    }
`;

const resolveFunctions = {
  JSON: GraphQLJSON,
  idList: idListScalar,
};
const schema = makeAugmentedSchema({ typeDefs, resolvers: resolveFunctions });


module.exports = schema;
