const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, { user, params }, context) => { //'context' stores the user auth token or status
            const foundUser = await User.findOne({ //copied from the user-ctonroller.js
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              });

            if (!foundUser) {
                throw new Error('Cannot find a user with this id!');
            }
    
            return foundUser;
        },
    },

    Mutation: {
        createUser: async (_, { body }, context) => {
            const user = await User.create(body);

            if (!user) {
                throw new Error('Something is wrong!');
            }

            const token = signToken(user);
            return { token, user };
        },

        login: async (_, { body }, context) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

            if (!user) {
                throw new Error("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(body.password);

            if (!correctPw) {
                throw new Error('Wrong password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (_, { user, body }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  { $addToSet: { savedBooks: body } },
                  { new: true, runValidators: true }
                );
        
                return updatedUser;
              } catch (err) {
                console.log(err);
                throw new Error(err);
              }
        },

        deleteBook: async (_, { user, params }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );
        
            if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
            }
        
            return updatedUser;
        },

    },
};

module.exports = resolvers;