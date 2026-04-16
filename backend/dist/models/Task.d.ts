import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITask>;
export default _default;
//# sourceMappingURL=Task.d.ts.map