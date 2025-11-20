// Temporarily commented out - using mock database instead
// TODO: Re-enable when switching back to mongoose

/*
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'File URL must be a valid URL',
      },
    },
    fileName: {
      type: String,
      maxlength: [255, 'File name cannot be more than 255 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ appointment: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// Compound index for conversation queries
messageSchema.index({ $or: [{ sender: 1, receiver: 1 }, { sender: 1, receiver: -1 }] });

// Pre-save middleware to validate file messages
messageSchema.pre('save', function (next) {
  if ((this.messageType === 'image' || this.messageType === 'file') && !this.fileUrl) {
    const error = new Error('File URL is required for image and file messages');
    return next(error);
  }
  next();
});

// Static method to get conversation between two users
messageSchema.statics.getConversation = function (user1Id: string, user2Id: string, limit = 50) {
  return this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role');
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = function (senderId: string, receiverId: string) {
  return this.updateMany(
    { sender: senderId, receiver: receiverId, isRead: false },
    { isRead: true }
  );
};

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
*/

// Placeholder export for now
export interface IMessage {
  sender: string;
  receiver: string;
  appointment?: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Message = null;
export default Message;