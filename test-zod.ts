import { z } from 'zod';

const scheduleSchema = z.object({
    selectedDate: z.string().min(1, 'Please select a date'),
    selectedTime: z.string().min(1, 'Please select a time slot'),
})

const result = scheduleSchema.safeParse({ selectedDate: '', selectedTime: '' });
if (!result.success) {
    console.log(JSON.stringify(result.error.issues, null, 2));
}
