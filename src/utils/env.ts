import dotenv from 'dotenv'
dotenv.config()

export const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY
export const region = process.env.AZURE_REGION
// Airtable SDK accesses process.env.AIRTABLE_API_KEY automatically
// But here it is just in case
export const airtableAPIKey = process.env.AIRTABLE_API_KEY
