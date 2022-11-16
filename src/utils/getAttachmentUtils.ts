import { Attachment } from 'airtable/lib/attachment'
import { FieldSet } from 'airtable/lib/field_set'
import AirtableRecord from 'airtable/lib/record'
import { extname } from 'node:path'

function getAttachmentsFromRecord(
    record: AirtableRecord<FieldSet>,
    columnName: string
): Attachment[] | null {
    const attachments = record.get(columnName) as Attachment[] | null
    if (
        attachments &&
        attachments.length > 0 &&
        // Extra conditions to check that the column really contains attachments
        attachments[0].id &&
        attachments[0].url &&
        attachments[0].size &&
        attachments[0].filename &&
        attachments[0].type
    ) {
        return attachments
    } else {
        return null
    }
}

export function getAttachmentExtension(
    record: AirtableRecord<FieldSet>,
    columnName: string
): string | null {
    const attachments = getAttachmentsFromRecord(record, columnName)
    if (attachments) {
        return extname(attachments[0].filename)
    } else {
        return null
    }
}

export function getAttachmentUrl(
    record: AirtableRecord<FieldSet>,
    columnName: string
): string | null {
    const attachments = getAttachmentsFromRecord(record, columnName)
    if (attachments) {
        return attachments[0].url
    } else {
        return null
    }
}
