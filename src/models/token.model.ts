import { Document, model, ObjectId, Schema } from "mongoose";

interface TokenDocument extends Document {
  user: ObjectId;
  refreshToken: string;
}

const TokenSchema = new Schema<TokenDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

export default model<TokenDocument>("Token", TokenSchema);
