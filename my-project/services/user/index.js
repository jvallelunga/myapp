var UserModel = require('#models/User');

module.exports = {
    create: async function(user) {
        return UserModel.create(user);
    },
    find: async function() {
        return UserModel.find();
    }
};
