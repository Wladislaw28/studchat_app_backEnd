import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  text: {
    type: string;
    require: boolean;
  };
  description: {
    type: string;
    require: boolean;
  };
  category: {
    type: string;
    require: boolean;
  };
  author: {
    type: Schema.Types.ObjectId;
    ref: string;
    require: true;
  };
}

const NewsSchema = new Schema(
  {
    text: { type: String, require: Boolean, minlength: 5 },
    description: { type: String, require: Boolean, minlength: 5 },
    category: { type: String, require: Boolean, minlength: 3 },
    author: { type: Schema.Types.ObjectId, ref: "User" }    
  },
  {
    timestamps: true,
    usePushEach: true,
  },
);

const NewsModel = mongoose.model<INews>('News', NewsSchema);

export default NewsModel;
