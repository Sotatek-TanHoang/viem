import { formatters } from './formatter.js'
import { serializers } from './serializer.js'

export const chainConfig = {
  formatters,
  serializers,
} as const
