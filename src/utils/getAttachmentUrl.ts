import { Attachment } from 'airtable/lib/attachment'
import { FieldSet } from 'airtable/lib/field_set'
import Record from 'airtable/lib/record'

export function getAttachmentUrl(
    record: Record<FieldSet>,
    columnName: string
): string | null {
    const images = record.get(columnName) as Attachment[] | null

    // TODO detect changes
    if (images && images.length > 0) {
        return images[0].url
    } else {
        return null
    }
}
