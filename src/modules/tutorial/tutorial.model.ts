import { Schema, model, models } from 'mongoose';
import { ITutorial } from './tutorial.interface';

const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Tutorial = models.Tutorial || model<ITutorial>('Tutorial', tutorialSchema);