import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PolicyType = 'refund' | 'shipping' | 'terms' | 'privacy' | 'faq';

export interface PolicySectionItem {
  id: string;
  heading: string;
  content: string;
  lastUpdated?: string;
}

@Schema({ timestamps: true, collection: 'policies' })
export class Policy extends Document {
  @Prop({ required: true, unique: true })
  type: PolicyType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ type: Array, default: [] })
  sections: PolicySectionItem[];

  @Prop({ default: true })
  isPublished: boolean;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
