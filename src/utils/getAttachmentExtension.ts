import { Attachment } from 'airtable/lib/attachment'
import { FieldSet } from 'airtable/lib/field_set'
import Record from 'airtable/lib/record'
import { extname } from 'node:path'

export function getAttachmentExtension(
    record: Record<FieldSet>,
    columnName: string
): string | null {
    const attachments = record.get(columnName) as Attachment[] | null

    if (attachments && attachments.length > 0) {
        return extname(attachments[0].filename)
    } else {
        return null
    }
}
