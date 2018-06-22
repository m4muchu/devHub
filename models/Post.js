const moongose = require("mongoose");
const Schema = moongose.Schema;

//create schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // it will point to the user id for identification as well as unity
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    // both name and avatar may programatically filled, if we delete the user and profile comment will be there
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    // here the likes are counted on the basis of user id and also one user can make one like only
    {
      user: {
        type: Schema.Types.ObjectId, // it will give the user id
        ref: "users"
      }
    }
  ],
  comments: [
    // array are used one person can comment more than one time
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = moongose.model("post", PostSchema);
