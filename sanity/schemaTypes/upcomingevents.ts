// schemaTypes/event.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      description: 'Day of the month, e.g. "05"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'month',
      title: 'Month',
      type: 'string',
      description: 'Three-letter month, e.g. "DEC"',
      validation: Rule => Rule.required().length(3),
    }),
    defineField({
      name: 'dateTimeLocation',
      title: 'Date, Time, and Location',
      type: 'string',
      description: 'Example: "8:00 PM - 9:00 PM - Engineering Building Atrium"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'E.g. Engineering, Career, Robotics',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
    }),
  ],
})
