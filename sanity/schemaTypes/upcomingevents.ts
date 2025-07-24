// schemaTypes/upcomingevents.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'upcomingEvents',
  title: 'Upcoming Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [
        defineField({
          name: 'eventItem',
          title: 'Event',
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'month',
              title: 'Month',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Event Title',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'dateTimeLocation',
              title: 'Date, Time, and Location',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
