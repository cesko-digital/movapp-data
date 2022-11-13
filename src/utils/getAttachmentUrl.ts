import { Attachment } from 'airtable/lib/attachment'
import { FieldSet } from 'airtable/lib/field_set'
import Record from 'airtable/lib/record'

export function getAttachmentUrl(
    record: Record<FieldSet>,
    columnName: string
): string | null {
    const attachments = record.get(columnName) as Attachment[] | null

    // TODO detect changes
    if (attachments && attachments.length > 0) {
        return attachments[0].url
    } else {
        return null
    }
}
