import { Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface ComparisonFeature {
  feature: string
  free: string | boolean
  plus: string | boolean
  premium: string | boolean
}

export interface FeatureComparisonTableProps {
  features: ComparisonFeature[]
}

function renderCell(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="text-primary mx-auto h-5 w-5" aria-label="Included" />
    ) : (
      <X
        className="text-muted-foreground/40 mx-auto h-5 w-5"
        aria-label="Not included"
      />
    )
  }
  return <span className="text-foreground text-sm">{value}</span>
}

export function FeatureComparisonTable({
  features,
}: FeatureComparisonTableProps) {
  return (
    <div className="border-border bg-card overflow-x-auto rounded-xl border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground w-[40%] font-semibold">
              Feature
            </TableHead>
            <TableHead className="text-foreground text-center font-semibold">
              Free
            </TableHead>
            <TableHead className="text-foreground text-center font-semibold">
              Plus
            </TableHead>
            <TableHead className="text-foreground text-center font-semibold">
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-foreground font-medium">
                {row.feature}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.free)}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.plus)}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.premium)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
